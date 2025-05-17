// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.30;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GovernanceToken is ERC20 {

    uint private rate = 1000;   // 1 ETH = 1000 GT

    error TransferFailed();
    error InsufficientBalance();
    
    constructor() ERC20("GovernanceToken", "GT") {
    }

    receive() external payable {
        buyTokens(msg.value);
    }

    function buyTokens(uint _value) private {
        _mint(msg.sender, _value * rate);
    }

    function sellTokens(uint _value) external {
        require(balanceOf(msg.sender) >= _value * 10**decimals(), InsufficientBalance());
        (bool success, ) = address(msg.sender).call{value: _value * 10**decimals() / rate}("");
        require(success, TransferFailed());
        _burn(msg.sender, _value * 10**decimals());
    }
}
