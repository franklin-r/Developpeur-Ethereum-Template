// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SavingAccount is Ownable {

    uint[] private depositHistory;
    uint private depositId;
    uint private initialDepositTime;

    error withdrawalFailed();
    error withdrawalTooEarly();

    constructor() Ownable(msg.sender) { }

    function deposit() external payable {
        if (initialDepositTime == 0) {
            initialDepositTime = block.timestamp;
        }
        depositId += 1;
        depositHistory.push(msg.value);
    }

    function withdraw() external onlyOwner() {
        require(block.timestamp >= initialDepositTime + 12 seconds, withdrawalTooEarly());
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, withdrawalFailed());        
    }

    // ========================= TEST FUNCTIONS =============================
    function getDepositHistory() external view returns (uint[] memory) {
        return depositHistory;
    }

    function getDepositId() external view returns (uint) {
        return depositId;
    }

    function getInitialDepositTime() external view returns (uint) {
        return initialDepositTime;
    }

}
