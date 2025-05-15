// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.28;

import {AlyraToken} from "./AlyraToken.sol";

contract Crowdsale {
    uint public rate = 200; // 1 wei = `rate` ALYbits
    AlyraToken public token;

    modifier minimumInvestment(uint256 value) {
        require(msg.value >= 0.1 ether, "Minimum investment of 0.1 ETH required.");
        _;
    }

    constructor(uint256 initialSupply) {
        token = new AlyraToken(initialSupply);
    }

    receive() external payable minimumInvestment(msg.value) {  
        distribute(msg.value);
    }

    function distribute(uint256 value) internal {
        uint256 tokensToSend = value * rate;
        token.transfer(msg.sender, tokensToSend);
    }
}
