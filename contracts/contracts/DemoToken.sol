// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DemoToken is ERC20, Ownable {
    constructor() ERC20("Demo QUSDC", "QUSDC") Ownable() {}

    function mint(uint256 amount) external {
        _mint(msg.sender, amount);
    }
}
