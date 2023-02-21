// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EDOToken is ERC20 {

    // uint256 constant initialSupply = 1000000 * (10**18);

    constructor() ERC20("EDOToken", "EDO") {
        // _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount * (10**18));
    }
}