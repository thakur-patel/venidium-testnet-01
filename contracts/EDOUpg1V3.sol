// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./EDOUpg1V2.sol";

// contract EDOUpg1V3 is ERC20Upgradeable, OwnableUpgradeable, EIP712Upgradeable {
contract EDOUpg1V3 is EDOUpg1V2 {

    // function setOwner() public onlyInitializing {
    //     __Ownable_init();
    // }

    function initialize(string memory name_, string memory symbol_) initializer public override {
        __ERC20_init(name_, symbol_);
        __Ownable_init();
    }
    // inserting new variable in upgradeable contract
    uint256 private upgvar3;

    function set_upgvar3(uint256 _upgvar3) public onlyOwner {
        upgvar3 = _upgvar3;
    }

    function get_upgvar3() public view returns (uint256) {
        return upgvar3;
    }
}