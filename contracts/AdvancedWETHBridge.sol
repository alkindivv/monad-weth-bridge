// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IWrappedETH.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AdvancedWETHBridge is Ownable, ReentrancyGuard {
    IWrappedETH public sepoliaWETH;

    mapping(bytes32 => bool) public processedTransactions;

    event TokensLocked(address indexed user, uint256 amount, bytes32 transactionId);
    event TokensUnlocked(address indexed user, uint256 amount, bytes32 transactionId);

    constructor(address _sepoliaWETH) {
        sepoliaWETH = IWrappedETH(_sepoliaWETH);
    }

    // Di Sepolia: Lock WETH
    function lockTokens(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");

        bytes32 transactionId = keccak256(abi.encodePacked(
            msg.sender,
            amount,
            block.timestamp
        ));

        require(!processedTransactions[transactionId], "Transaction already processed");

        // Transfer WETH dari user ke bridge
        require(sepoliaWETH.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        processedTransactions[transactionId] = true;
        emit TokensLocked(msg.sender, amount, transactionId);
    }

    // Di Monad: Langsung kirim MON ke user
    function unlockTokens(
        address payable user,
        uint256 amount,
        bytes32 transactionId
    ) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(!processedTransactions[transactionId], "Transaction already processed");

        // Transfer MON langsung ke user
        (bool success,) = user.call{value: amount}("");
        require(success, "MON transfer failed");

        processedTransactions[transactionId] = true;
        emit TokensUnlocked(user, amount, transactionId);
    }

    receive() external payable {}
}