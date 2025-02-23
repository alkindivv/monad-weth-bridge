// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IMonadWETH {
    function grantRole(bytes32 role, address account) external;
    function MINTER_ROLE() external view returns (bytes32);
    function hasRole(bytes32 role, address account) external view returns (bool);
    function mint(address to, uint256 amount) external;
}