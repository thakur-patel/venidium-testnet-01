// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./EDOUpg1V2.sol";

// contract EDOUpg1V3 is ERC20Upgradeable, OwnableUpgradeable, EIP712Upgradeable {
contract EDOUpg1V3 is EDOUpg1V2 {

    // function initialize(string memory name_, string memory symbol_) initializer public {
    //     // __ERC20_init(name_, symbol_);
    //     __Ownable_init();
    // }

    // function initializeV3() initializer virtual public {

    // }

    // address private _owner_;

    // inserting new variable in upgradeable contract
    uint256 private upgvar3;

    function set_upgvar3(uint256 _upgvar3) virtual public onlyOwner {
        upgvar3 = _upgvar3;
    }

    function get_upgvar3() virtual public view returns (uint256) {
        return upgvar3;
    }

    // function showSender() virtual public returns (address) {
    //     _owner_ = msg.sender;
    //     console.log(msg.sender);
    //     return msg.sender;
    // }
    
    // inserting new variable in upgradeable contract which is not onlyOnwer
    uint256 private upgvar4;

    function set_upgvar4(uint256 _upgvar4) virtual public {
        upgvar4 = _upgvar4;
    }

    function get_upgvar4() virtual public view returns (uint256) {
        return upgvar3;
    }
}