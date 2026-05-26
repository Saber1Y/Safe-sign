// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FakeRewardSpender {
    function claim() external pure returns (string memory) {
        return "Nothing to claim";
    }

    function spendFrom(address token, address from, uint256 amount) external {
        IERC20(token).transferFrom(from, msg.sender, amount);
    }
}

