// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IWrappedETH.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AdvancedWETHBridge is Ownable, ReentrancyGuard {
    IWrappedETH public sepoliaWETH;
    IWrappedETH public monadWETH;

    // Relayer address
    address public relayer;

    // Track processed transactions
    mapping(bytes32 => bool) public processedTx;

    event BridgeInitiated(address indexed user, uint256 amount, bytes32 txId);
    event BridgeCompleted(address indexed user, uint256 amount, bytes32 txId);

    constructor(
        address _sepoliaWETH,
        address _monadWETH,
        address _relayer
    ) {
        sepoliaWETH = IWrappedETH(_sepoliaWETH);
        monadWETH = IWrappedETH(_monadWETH);
        relayer = _relayer;
    }

    function setRelayer(address _relayer) external onlyOwner {
        relayer = _relayer;
    }

    // Di Sepolia: Terima WETH dan unwrap ke ETH
    function bridgeToMonad(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");

        // Generate unique transaction ID
        bytes32 txId = keccak256(abi.encodePacked(
            msg.sender,
            amount,
            block.timestamp,
            block.number
        ));

        // Transfer WETH dari user dan unwrap ke ETH
        require(sepoliaWETH.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        sepoliaWETH.withdraw(amount);

        emit BridgeInitiated(msg.sender, amount, txId);
    }

    // Di Monad: Terima ETH dari relayer dan convert ke WETH
    function completeBridge(
        address user,
        uint256 amount,
        bytes32 txId
    ) external payable nonReentrant {
        require(msg.sender == relayer, "Only relayer can complete bridge");
        require(msg.value >= amount, "Insufficient bridged ETH");
        require(!processedTx[txId], "Transaction already processed");

        processedTx[txId] = true;

        // Convert ETH ke WETH dan kirim ke user
        monadWETH.deposit{value: amount}();
        require(monadWETH.transfer(user, amount), "Transfer failed");

        emit BridgeCompleted(user, amount, txId);
    }

    receive() external payable {}
}