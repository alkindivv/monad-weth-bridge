// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IWrappedETH is IERC20 {
    function deposit() external payable;
    function withdraw(uint256) external;
    function mint(address to, uint256 amount) external;
}