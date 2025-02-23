// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IMonadBridge {
    function depositETH() external payable returns (uint256);
    function withdrawETH(uint256 amount) external;
    function depositERC20(address token, uint256 amount) external returns (uint256);
    function withdrawERC20(address token, uint256 amount) external;
}

interface IWETH {
    function deposit() external payable;
    function withdraw(uint256) external;
    function balanceOf(address) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
}

contract MonadBridgeHelper {
    IMonadBridge public bridge;
    IWETH public weth;

    event DebugStep(string step, uint256 amount);
    event DebugBalance(string message, uint256 balance);

    constructor(address _bridge, address _weth) {
        bridge = IMonadBridge(_bridge);
        weth = IWETH(_weth);
    }

    function bridgeETHToWETH() external payable {
        require(msg.value > 0, "Must send MON");

        // Log initial balance
        emit DebugBalance("Initial ETH balance", address(this).balance);

        // Convert MON to ETH via bridge
        emit DebugStep("Converting MON to ETH", msg.value);
        uint256 ethAmount = bridge.depositETH{value: msg.value}();
        emit DebugStep("Received ETH amount", ethAmount);

        // Log balance after bridge
        emit DebugBalance("Balance after bridge", address(this).balance);

        // Convert ETH to WETH
        emit DebugStep("Converting ETH to WETH", ethAmount);
        weth.deposit{value: ethAmount}();

        // Check WETH balance
        uint256 wethBalance = weth.balanceOf(address(this));
        emit DebugBalance("WETH balance", wethBalance);

        // Transfer WETH to sender
        require(weth.transfer(msg.sender, wethBalance), "WETH transfer failed");
        emit DebugStep("WETH transferred", wethBalance);
    }

    // To receive ETH from bridge
    receive() external payable {
        emit DebugStep("Received ETH", msg.value);
    }
}