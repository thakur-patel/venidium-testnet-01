pragma solidity ^0.8.0;

/*
Sign{
    "nonce": 0,
    "amount": 100
}
Sign{
    "nonce": 1,
    "amount": 150
}
Sign{
    "nonce": 2,
    "amount": 500
}
*/

contract Verifier {
    uint256 constant chainId = block.chainid;
    address constant verifyingContract = this.address;
    // address constant verifyingContract = 0x1C56346CD2A2Bf3202F771f50d3D14a367B48070;
    // bytes32 constant salt = 0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558;
    
    // Definition on encodeType
    // The type of a struct is encoded as [name ‖ "(" ‖ member₁ ‖ "," ‖ member₂ ‖ "," ‖ … ‖ memberₙ ")"] where each member is written as [type ‖ " " ‖ name].
    string private constant EIP712_DOMAIN  = "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"; 
    string private constant SIGN_TYPE = "Sign(uint256 nonce,uint256 amount)"; 
    
    // Definition of typeHash
    bytes32 private constant EIP712_DOMAIN_TYPEHASH = keccak256(abi.encodePacked(EIP712_DOMAIN));
    bytes32 private constant SIGN_TYPEHASH = keccak256(abi.encodePacked(SIGN_TYPE));

    // Defintion of domainSeparator, which is a hashStruct
    bytes32 private constant DOMAIN_SEPARATOR = keccak256(abi.encode(
        EIP712_DOMAIN_TYPEHASH,
        // Defintion of encodeData:
        // The encoding of a struct instance is enc(value₁) ‖ enc(value₂) ‖ … ‖ enc(valueₙ), i.e. the concatenation of the encoded member values in the order that they appear in the type. Each encoded member value is exactly 32-byte long.
        // https://eips.ethereum.org/EIPS/eip-712#definition-of-encodedata for more details
        keccak256("Test dApp"),// bytes and string are encoded as their keccak256 hash. It returns a 32 byte array or a 256 bit string
        keccak256("1"),// bytes and string are encoded as their keccak256 hash. It returns a 32 byte array or a 256 bit string
        chainId,
        verifyingContract
    ));
        
    struct Sign {
        uint256 nonce;
        uint256 amount;
    }
        
    // Definition of a hashStruct
    function hashSign(Sign memory sign) private pure returns (bytes32){
        return keccak256(abi.encodePacked(
            "\\x19\\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(
                SIGN_TYPEHASH,
                sign.nonce,
                sign.amount
            ))
        ));
    }
    
    function verify() public pure returns (bool) {
        
        Sign memory sign = Sign({
            nonce: 0,
            amount: 100
        });
            
        bytes32 sigR = <SIGR>;
        bytes32 sigS = <SIGS>;
        uint8 sigV = <SIGV>;
        address signer = <SIGNER>;
    
        return signer == ecrecover(hashSign(sign), sigV, sigR, sigS);
    }
}