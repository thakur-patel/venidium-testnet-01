// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

contract Marketplace is Initializable, UUPSUpgradeable, EIP712Upgradeable, AccessControlEnumerableUpgradeable {

    string constant EIP712DomainName = "venidium marketplace";
    string constant EIP712DomainSigning = "0.0.1";

    bytes32 public constant FUND_MANAGER = keccak256("FUND_MANAGER"); // can change the marketplaceCommisionBeneficiary and marketplaceCommisionPermille
    bytes32 public constant TOKEN_MANAGER = keccak256("TOKEN_MANAGER"); // can call setSettlementTokenStatus to change settlement token status
    bytes32 public constant EXECUTOR = keccak256("EXECUTOR"); // can execute/finalise auctions
    
    uint256 marketplaceCommisionPermille;
    address marketplaceCommisionBeneficiary;
    
    struct sellSignature {
        address seller;
        address token;
        uint256 id;
        address settlementToken;
        uint256 settlementPrice;
        uint256 nonce;
        bytes signature;
    }
    
    struct offerSignature {
        address buyer;
        address token;
        uint256 id;
        address settlementToken;
        uint256 settlementPrice;
        uint256 deadline;
        uint256 nonce;
        bytes signature;
    }
    
    struct auctionSignature {
        address seller;
        address token;
        uint256 id;
        address settlementToken;
        uint256 minimumBidPrice;
        uint256 reservePrice;
        uint256 expirationDate;
        uint256 nonce;
        bytes signature;
    }
    
    struct bidSignature {
        address bidder;
        address token;
        uint256 id;
        address settlementToken;
        uint256 bidValue;
        uint256 nonce;
        bytes signature;
    }

    mapping (bytes32 => bool) private sigCancelledMap;
    mapping (address => bool) private settlementTokenStatusMap;

    event BoughtWithSig(address indexed seller, address indexed buyer, address indexed settlementToken, uint256 price); // payment token 0 means ethereum
    event SignatureCancelled(address indexed signer, bytes32 indexed signatureHash);

    /// @notice constructor used to force implementation initialization
    /// @dev https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#initializing_the_implementation_contract
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __UUPSUpgradeable_init();
        __EIP712_init(EIP712DomainName, EIP712DomainSigning);
        __AccessControlEnumerable_init();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(TOKEN_MANAGER, msg.sender);
        _setupRole(EXECUTOR, msg.sender);
        
        marketplaceCommisionPermille = 0; // 25 permille = 2.5 percent
        marketplaceCommisionBeneficiary = msg.sender;

        settlementTokenStatusMap[0x7d45d91421EA7c6293B48C45Fd37E038D032A334] = true; // WXVM on venidium mainnet

        // settlementTokenStatusMap[0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6] = true; // WETH on goerli
        // settlementTokenStatusMap[0xaFF4481D10270F50f203E0763e2597776068CBc5] = true; // WEENUS on goerli
        // settlementTokenStatusMap[0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c] = true; // XEENUS on goerli
        // settlementTokenStatusMap[0xc6fDe3FD2Cc2b173aEC24cc3f267cb3Cd78a26B7] = true; // YEENUS on goerli
        // settlementTokenStatusMap[0x1f9061B953bBa0E36BF50F21876132DcF276fC6e] = true; // ZEENUS on goerli
    }

    /// @notice Checks if the upgrade is authorized
    //  @param newImplementation this is the new implementation passed from upgradeTo
    function _authorizeUpgrade(address) internal view override {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Account has no admin role"
        );
    }

    function setSettlementTokenStatus(address settlementToken, bool status) public {
        require(hasRole(TOKEN_MANAGER, msg.sender), "user doesn't have TOKEN_MANAGER role");
        settlementTokenStatusMap[settlementToken] = status;
    }

    function cancelSellSig(sellSignature memory sellSig) public {
        require(msg.sender == sellSig.seller, "only seller can cancel a sell signature");
        bytes32 sigHash = keccak256(sellSig.signature);
        require(sigCancelledMap[sigHash] == false, "signature was cancelled already");
        
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("sellBySig(address seller,address token,uint256 id,address settlementToken,uint256 settlementPrice,uint256 nonce)"),
            sellSig.seller,
            sellSig.token,
            sellSig.id,
            sellSig.settlementToken,
            sellSig.settlementPrice,
            sellSig.nonce
        )));
        address signer = ECDSA.recover(digest, sellSig.signature);

        require(signer == sellSig.seller, "seller mismatch");
        require(signer != address(0), "seller cannot be 0");

        sigCancelledMap[sigHash] = true;
        emit SignatureCancelled(signer, sigHash);
    }

    function cancelOfferSig(offerSignature memory offerSig) public {
        require(msg.sender == offerSig.buyer, "only buyer can cancel an offer signature");
        bytes32 sigHash = keccak256(offerSig.signature);
        require(sigCancelledMap[sigHash] == false, "signature was cancelled already");
        
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("offerSig(address buyer,address token,uint256 id,address settlementToken,uint256 settlementPrice,uint256 deadline,uint256 nonce)"),
            offerSig.buyer,
            offerSig.token,
            offerSig.id,
            offerSig.settlementToken,
            offerSig.settlementPrice,
            offerSig.deadline,
            offerSig.nonce
        )));
        address signer = ECDSA.recover(digest, offerSig.signature);

        require(signer == offerSig.buyer, "buyer mismatch");
        require(signer != address(0), "buyer cannot be 0");

        sigCancelledMap[sigHash] = true;
        emit SignatureCancelled(signer, sigHash);
    }

    function cancelAuctionSig(auctionSignature memory auctionSig) public {
        require(msg.sender == auctionSig.seller, "only seller can cancel a sell signature");
        bytes32 sigHash = keccak256(auctionSig.signature);
        require(sigCancelledMap[sigHash] == false, "signature was cancelled already");
        
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("sellByAuction(address seller,address token,uint256 id,address settlementToken,uint256 minimumBidPrice,uint256 reservePrice,uint256 expirationDate,uint256 nonce)"),
            auctionSig.seller,
            auctionSig.token,
            auctionSig.id,
            auctionSig.settlementToken,
            auctionSig.minimumBidPrice,
            auctionSig.reservePrice,
            auctionSig.expirationDate,
            auctionSig.nonce
        )));
        address signer = ECDSA.recover(digest, auctionSig.signature);

        require(signer == auctionSig.seller, "seller mismatch");
        require(signer != address(0), "seller cannot be 0");

        sigCancelledMap[sigHash] = true;
        emit SignatureCancelled(signer, sigHash);
    }

    function cancelBidSig(bidSignature memory bidSig) public {
        require(msg.sender == bidSig.bidder, "only bidder can cancel an bid signature");
        bytes32 sigHash = keccak256(bidSig.signature);
        require(sigCancelledMap[sigHash] == false, "signature was cancelled already");
        
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("bidSignature(address bidder,address token,uint256 id,address settlementToken,uint256 bidValue,uint256 nonce)"),
            bidSig.bidder,
            bidSig.token,
            bidSig.id,
            bidSig.settlementToken,
            bidSig.bidValue,
            bidSig.nonce
        )));
        address signer = ECDSA.recover(digest, bidSig.signature);

        require(signer == bidSig.bidder, "bidder mismatch");
        require(signer != address(0), "bidder cannot be 0");

        sigCancelledMap[sigHash] = true;
        emit SignatureCancelled(signer, sigHash);
    }

    // struct sellSignature {
    //     address seller;
    //     address token;
    //     uint256 id;
    //     address settlementToken;
    //     uint256 settlementPrice;
    //     uint256 nonce;
    //     bytes signature;
    // }
    
    function buyBySig(sellSignature memory sellSig) public payable {
        bytes32 sigHash = keccak256(sellSig.signature);
        require(sigCancelledMap[sigHash] == false, "singature was cancelled");
        IERC721 token = IERC721(sellSig.token);
        require(token.ownerOf(sellSig.id) != msg.sender, "user is already the owner of this NFT");
        require(token.ownerOf(sellSig.id) == sellSig.seller, "seller is no longer the owner of this NFT");
        require(token.isApprovedForAll(token.ownerOf(sellSig.id), address(this)), "marketplace not approved as an operator");

        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("sellBySig(address seller,address token,uint256 id,address settlementToken,uint256 settlementPrice,uint256 nonce)"),
            sellSig.seller,
            sellSig.token,
            sellSig.id,
            sellSig.settlementToken,
            sellSig.settlementPrice,
            sellSig.nonce
        )));
        address signer = ECDSA.recover(digest, sellSig.signature);

        require(signer == sellSig.seller, "seller mismatch");
        require(signer != address(0), "seller cannot be 0");

        uint256 marketplaceCommision = sellSig.settlementPrice*marketplaceCommisionPermille/1000;

        if (sellSig.settlementToken==address(0)) {
            require(msg.value >= sellSig.settlementPrice, "not enough funds");

            uint256 excess = msg.value - sellSig.settlementPrice;
            if (excess>0) {
                payable(msg.sender).transfer(excess);
            }

            payable(sellSig.seller).transfer(sellSig.settlementPrice-marketplaceCommision);
            payable(marketplaceCommisionBeneficiary).transfer(marketplaceCommision);
        } else {
            IERC20 settlementToken = IERC20(sellSig.settlementToken);
            require(settlementTokenStatusMap[address(settlementToken)], "ERC20 token not approved as a settlement token");
            require(settlementToken.allowance(msg.sender, address(this)) >= sellSig.settlementPrice, "marketplace not approved to spend the settlement price out of user's balance");

            settlementToken.transferFrom(msg.sender, sellSig.seller, sellSig.settlementPrice-marketplaceCommision);
            settlementToken.transferFrom(msg.sender, marketplaceCommisionBeneficiary, marketplaceCommision);
        }

        token.transferFrom(sellSig.seller, msg.sender, sellSig.id);
        emit BoughtWithSig(sellSig.seller, msg.sender, sellSig.settlementToken, sellSig.settlementPrice);

        sigCancelledMap[sigHash] = true;
        emit SignatureCancelled(signer, sigHash);
    }

    function acceptOfferSig(offerSignature memory offerSig) public {
        // check if signature is cancelled
        bytes32 sigHash = keccak256(offerSig.signature);
        require(sigCancelledMap[sigHash] == false, "singature was cancelled");

        // check that msg.sender isn't offerSig.buyer
        require(offerSig.buyer != msg.sender, "user cannot accept their own offer");

        IERC721 token = IERC721(offerSig.token);
        // check if offerSig.buyer doesn't own the NFT
        require(token.ownerOf(offerSig.id) != offerSig.buyer, "buyer already owns the NFT");

        // check if msg.sender still owns the NFT
        require(token.ownerOf(offerSig.id) == msg.sender, "user doesn't own this NFT");

        // check if the marketplace is approved for all NFTs of msg.sender for this smart contract
        require(token.isApprovedForAll(msg.sender, address(this)), "marketplace not approved as an operator");

        // check that settlement token is not address(0)
        require(offerSig.settlementToken != address(0), "cannot accept ETH offers");

        IERC20 settlementToken = IERC20(offerSig.settlementToken);
        // check if settlement token is in the approved list
        require(settlementTokenStatusMap[address(settlementToken)], "ERC20 token not approved as a settlement token");

        // recover the signer's address
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("offerSig(address buyer,address token,uint256 id,address settlementToken,uint256 settlementPrice,uint256 deadline,uint256 nonce)"),
            offerSig.buyer,
            offerSig.token,
            offerSig.id,
            offerSig.settlementToken,
            offerSig.settlementPrice,
            offerSig.deadline,
            offerSig.nonce
        )));
        address signer = ECDSA.recover(digest, offerSig.signature);

        // check if the signer's address matches offerSig.buyer
        require(signer == offerSig.buyer, "buyer mismatch");
        // check if the signer's address isn't address(0)
        require(signer != address(0), "buyer cannot be 0");

        // check that offerSig.buyer allowed the marketplace to spend enough coins
        require(settlementToken.allowance(offerSig.buyer, address(this)) >= offerSig.settlementPrice, "marketplace not approved to spend the settlement price out of buyer's balance");

        // calculate marketplace's commission
        uint256 marketplaceCommision = offerSig.settlementPrice*marketplaceCommisionPermille/1000;
        // transfer commision from offerSig.buyer to marketplace
        settlementToken.transferFrom(offerSig.buyer, marketplaceCommisionBeneficiary, marketplaceCommision);
        // transfer price-commision offerSig.buyer to msg.sender
        settlementToken.transferFrom(offerSig.buyer, msg.sender, offerSig.settlementPrice-marketplaceCommision);
        // transfer NFT from msg.sender to offerSig.buyer
        token.transferFrom(msg.sender, offerSig.buyer, offerSig.id);

        // cancel the offerHash
        sigCancelledMap[sigHash] = true;
        // emit signature cancellation event
        emit SignatureCancelled(signer, sigHash);
    }

    function acceptBid(bidSignature memory bidSig, auctionSignature memory auctionSig) public {
        IERC721 token = IERC721(auctionSig.token);
        address nftOwner = token.ownerOf(auctionSig.id);

        if (hasRole(EXECUTOR, msg.sender)) {
            // check if seller is 
            require(nftOwner == auctionSig.seller, "seller doesn't own the NFT");
            // check if auction expired
            require(block.timestamp >= auctionSig.expirationDate, "auction didn't expire yet");
        } else {
            // check if msg.sender == auctionSig.seller
            require(auctionSig.seller == msg.sender, "user not the auction seller");
            // check if msg.sender != bidSig.bidder
            require(bidSig.bidder != msg.sender, "user cannod be the bidder");
            // check if msg.sender still has the NFT
            require(nftOwner == msg.sender, "user does not own the NFT");
        }

        bytes32 auctionSigHash = keccak256(auctionSig.signature);
        // check if auctionSig is not cancelled
        require(!sigCancelledMap[auctionSigHash], "auction signature is cancelled");

        bytes32 bidSigHash = keccak256(bidSig.signature);
        // check if bidSig is not cancelled
        require(!sigCancelledMap[bidSigHash], "bid signature is cancelled");
        // check if bidSig.token == auctionSig.token
        require(auctionSig.token == bidSig.token, "NFT contract mismatch");
        // check if bidSig.id == auctionSig.id
        require(auctionSig.id == bidSig.id, "token ID mismatch");
        // check if bidSig.settlementToken == auctionSig.settlementToken
        require(auctionSig.settlementToken == bidSig.settlementToken, "settlement token missmatch");
        // check if settlement token is not address(0)
        require(auctionSig.settlementToken != address(0), "settlement token for auctions/bids cannot be ether");
        // check if settlement token is in the approved list
        require(settlementTokenStatusMap[auctionSig.settlementToken], "settlement token is not approved");

        bytes32 auctionSigDigest = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("sellByAuction(address seller,address token,uint256 id,address settlementToken,uint256 minimumBidPrice,uint256 reservePrice,uint256 expirationDate,uint256 nonce)"),
            auctionSig.seller,
            auctionSig.token,
            auctionSig.id,
            auctionSig.settlementToken,
            auctionSig.minimumBidPrice,
            auctionSig.reservePrice,
            auctionSig.expirationDate,
            auctionSig.nonce
        )));
        address auctionSigSigner = ECDSA.recover(auctionSigDigest, auctionSig.signature);
        // check if auctionSig signer == auctionSig.seller
        require(auctionSigSigner == auctionSig.seller, "seller mismatch");
        // check if auctionSig signer != address(0)
        require(auctionSigSigner != address(0), "seller cannot be 0");

        bytes32 bidSigDigest = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("bidSignature(address bidder,address token,uint256 id,address settlementToken,uint256 bidValue,uint256 nonce)"),
            bidSig.bidder,
            bidSig.token,
            bidSig.id,
            bidSig.settlementToken,
            bidSig.bidValue,
            bidSig.nonce
        )));
        address bidSigSigner = ECDSA.recover(bidSigDigest, bidSig.signature);
        // check if bidSig signer == bidSig.bidder
        require(bidSigSigner == bidSig.bidder, "bidder mismatch");
        // check if bidSig signer != address(0)
        require(bidSigSigner != address(0), "bidder cannot be 0");

        // check if marketplace is authorized for all auctionSig.seller's auctionSig tokens
        require(token.isApprovedForAll(auctionSig.seller, address(this)), "marketplace is not approved as an operator");

        IERC20 settlementToken = IERC20(auctionSig.settlementToken);
        // check if marketplace is approved to spend enough bidSig.settlementToken of bidSig.bidder's
        require(settlementToken.allowance(bidSig.bidder, address(this)) >= bidSig.bidValue, "marketplace not allowed to spend enough tokens");

        // calculate marketplace's commision
        uint256 marketplaceCommision = bidSig.bidValue*marketplaceCommisionPermille/1000;
        // transfer commision from bidSig.bidder to marketplace
        settlementToken.transferFrom(bidSig.bidder, marketplaceCommisionBeneficiary, marketplaceCommision);
        // transfer price-commision from bidSig.bidder to auctionSig.seller
        uint256 sellerCommision = bidSig.bidValue - marketplaceCommision;
        settlementToken.transferFrom(bidSig.bidder, auctionSig.seller, sellerCommision);
        // transfer NFT from auctionSig.seller to bidSig.bidder
        token.transferFrom(auctionSig.seller, bidSig.bidder, auctionSig.id);

        // cancel the auctionSig
        sigCancelledMap[auctionSigHash] = true;
        // emit signature cancellation event for auctionSig
        emit SignatureCancelled(auctionSig.seller, auctionSigHash);

        // cancel the bidSig
        sigCancelledMap[bidSigHash] = true;
        // emit signature cancellation event for bidSig
        emit SignatureCancelled(bidSig.bidder, bidSigHash);
    }
}