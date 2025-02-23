// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IWrappedETH is IERC20 {
    function deposit() external payable;
    function withdraw(uint256) external;
}

contract AdvancedWETHBridge is Ownable, ReentrancyGuard {
    IWrappedETH public sepoliaWETH;
    IWrappedETH public monadWETH;

    mapping(bytes32 => bool) public processedTransactions;

    event TokensLocked(address indexed user, uint256 amount, bytes32 transactionId);
    event TokensUnlocked(address indexed user, uint256 amount, bytes32 transactionId);
    event BridgeStep(string step, uint256 amount);
    event DebugBalance(string message, uint256 balance);

    constructor(address _sepoliaWETH, address _monadWETH) {
        sepoliaWETH = IWrappedETH(_sepoliaWETH);
        monadWETH = IWrappedETH(_monadWETH);
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

    // Di Monad: Mint WETH ke user
    function unlockTokens(
        address user,
        uint256 amount,
        bytes32 transactionId
    ) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(!processedTransactions[transactionId], "Transaction already processed");

        // Mint WETH ke user di Monad
        require(monadWETH.transfer(user, amount), "WETH transfer failed");

        processedTransactions[transactionId] = true;
        emit TokensUnlocked(user, amount, transactionId);
    }

    receive() external payable {}
}