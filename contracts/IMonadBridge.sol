// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IMonadBridge {
    function depositETH() external payable returns (uint256);
    function withdrawETH(uint256 amount) external;
}