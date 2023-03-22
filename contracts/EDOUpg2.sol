// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

contract EDOUpg2 is ERC20Upgradeable, OwnableUpgradeable, EIP712Upgradeable, UUPSUpgradeable {

    // uint256 constant initialSupply = 1000000 * (10**18);
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory name_, string memory symbol_) initializer public {
        __ERC20_init(name_, symbol_);
        __Ownable_init();
        __UUPSUpgradeable_init();

        // __AccessControlEnumerable_init();
        // _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // _grantRole(MINTER_ROLE, msg.sender);
        // _grantRole(UPGRADER_ROLE, msg.sender);
    }

    function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

    uint private upgvar1;

    function set_upgvar1(uint256 _upgvar1) public {
        upgvar1 = _upgvar1;
    }

    function get_upgvar1() public view returns (uint256) {
        return upgvar1;
    }

    struct SignedMessage {
        uint256 amount;
        uint256 nonce;
        bytes signature;
        // address minter;
    }

    bytes32 public constant VERIFY_PLAIN_TYPEHASH = keccak256("SignedMessage(uint256 nonce,uint256 amount)");

    mapping (bytes32 => bool) private sigStatusMap;
    // true if signature is used. false if signature isn't used.

    // inserting new variable in upgradeable contract
    uint private upgvar2;

    function set_upgvar2(uint256 _upgvar2) public {
        upgvar2 = _upgvar2;
    }

    function get_upgvar2() public view returns (uint256) {
        return upgvar2;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount * (10**18));
    }

    function verify(bytes memory data, bytes memory signature) public returns (address) {
        
        SignedMessage memory Sign;

        (Sign.nonce, Sign.amount) = abi.decode(
            data,
            (uint256, uint256)
        );
        Sign.signature = signature;

        bytes32 sigHash = keccak256(Sign.signature);
        require(sigStatusMap[sigHash] == false, "This signature has been used.");
        // console.log(Sign.amount);
        // console.log(Sign.nonce);
        // return Sign.signature;
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            VERIFY_PLAIN_TYPEHASH,
            Sign.nonce,
            Sign.amount
        )));
        address signer = ECDSAUpgradeable.recover(digest, Sign.signature);
        
        require(signer == owner(), "You aren't allowed to mint this.");
        require(signer != address(0), "Minter cannot be 0x000...");
        _mint(msg.sender, Sign.amount * (10**18));

        sigStatusMap[sigHash] = true;
        return signer;
    }
}