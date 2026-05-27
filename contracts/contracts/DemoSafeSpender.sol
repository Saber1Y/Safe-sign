// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DemoSafeSpender {
    function spend(address token, address from, uint256 amount) external {
        IERC20(token).transferFrom(from, msg.sender, amount);
    }
}

