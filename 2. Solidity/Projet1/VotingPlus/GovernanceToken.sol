// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.30;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GovernanceToken is ERC20 {

    uint private rate = 1000;   // 1 wei = 1000 GTbits

    error TransferFailed();
    error InsufficientBalance();
    error InsufficientValue();
    
    constructor() ERC20("GovernanceToken", "GT") {
    }

    receive() external payable {
        buyTokens(msg.value);
    }

    function buyTokens(uint _value) private {
        _mint(msg.sender, _value * rate);
    }

    // _value in bits
    function sellTokens(uint _value) external {
        require(balanceOf(msg.sender) >= _value, InsufficientBalance());
        require(balanceOf(msg.sender) >= rate, InsufficientValue());
        (bool success, ) = address(msg.sender).call{value: _value / rate}("");
        require(success, TransferFailed());
        _burn(msg.sender, _value);
    }
}
