pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract Verifier is EIP712 {

    constructor() EIP712("Sign and Mint", "0.0.1") {}
    
    struct SignedMessage {
        uint256 amount;
        uint256 nonce;
        bytes signature;
    }

    // string private constant SIGN_TYPE = "Sign(uint256 nonce,uint256 amount)"; 
    // bytes32 private constant SIGN_TYPEHASH = keccak256(abi.encodePacked(SIGN_TYPE));
    bytes32 public constant VERIFY_PLAIN_TYPEHASH = keccak256("SignedMessage(uint256 nonce,uint256 amount)");

    // function _verify(bytes32 hash, bytes memory signature) public pure returns (address){
    //     address recovered = ECDSA.recover(hash, signature);
    //     return recovered;
    // }

    // function verfiy(verifyStruct memory Sign) public returns (address) {
    //     bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
    //         keccak256("sellBySig(address seller,address token,uint256 id,address settlementToken,uint256 settlementPrice,uint256 nonce)"),
    //         Sign.amount,
    //         Sign.nonce
    //     )));
    // address signer = ECDSA.recover(digest, Sign.signature);
    // return signer;
    // }
    
    function verify(bytes memory data, bytes memory signature) public view returns (address) {
        
        SignedMessage memory Sign;

        (Sign.nonce, Sign.amount) = abi.decode(
            data,
            (uint256, uint256)
        );
        Sign.signature = signature;
        // console.log(Sign.amount);
        // console.log(Sign.nonce);
        // return Sign.signature;
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            VERIFY_PLAIN_TYPEHASH,
            Sign.nonce,
            Sign.amount
        )));
        address signer = ECDSA.recover(digest, Sign.signature);
        return signer;
    }
}