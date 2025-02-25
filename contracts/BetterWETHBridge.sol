// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BetterWETHBridge is Ownable, ReentrancyGuard {
    IERC20 public sepoliaWETH;
    IERC20 public monadWETH;

    mapping(bytes32 => bool) public processedTransactions;

    event TokensLocked(address indexed user, uint256 amount, bytes32 transactionId);
    event TokensUnlocked(address indexed user, uint256 amount, bytes32 transactionId);

    constructor(address _sepoliaWETH, address _monadWETH) {
        sepoliaWETH = IERC20(_sepoliaWETH);
        monadWETH = IERC20(_monadWETH);
    }

    function lockTokens(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");

        bytes32 transactionId = keccak256(abi.encodePacked(
            msg.sender,
            amount,
            block.timestamp
        ));

        require(!processedTransactions[transactionId], "Transaction already processed");

        // Lock WETH di Sepolia
        require(sepoliaWETH.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        processedTransactions[transactionId] = true;
        emit TokensLocked(msg.sender, amount, transactionId);
    }

    function unlockTokens(
        address user,
        uint256 amount,
        bytes32 transactionId
    ) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(!processedTransactions[transactionId], "Transaction already processed");

        // Transfer WETH di Monad
        require(monadWETH.transfer(user, amount), "Transfer failed");

        processedTransactions[transactionId] = true;
        emit TokensUnlocked(user, amount, transactionId);
    }
}