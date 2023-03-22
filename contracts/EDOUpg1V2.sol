// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./EDOUpg1.sol";

contract EDOUpg1V2 is EDOUpg1 {

    // inserting new variable in upgradeable contract
    uint private upgvar2;

    function set_upgvar2(uint256 _upgvar2) public {
        upgvar2 = _upgvar2;
    }

    function get_upgvar2() public view returns (uint256) {
        return upgvar2;
    }
    
}