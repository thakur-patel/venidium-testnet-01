// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EDOToken is ERC20, EIP712, Ownable {

    // uint256 constant initialSupply = 1000000 * (10**18);

    constructor() ERC20("EDOToken", "EDO") EIP712("Sign and Mint", "0.0.1") {
        // _mint(msg.sender, initialSupply);
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

    function mint(address to, uint256 amount) public {
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
        address signer = ECDSA.recover(digest, Sign.signature);
        
        require(signer == owner(), "You aren't allowed to mint this.");
        require(signer != address(0), "Minter cannot be 0x000...");
        _mint(msg.sender, Sign.amount * (10**18));

        sigStatusMap[sigHash] = true;
        return signer;
    }
}