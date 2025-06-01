// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.30;

contract Vault {

    mapping(address => uint) public balances;

    function store() public payable {
        balances[msg.sender] += msg.value;
    }

    function redeem() public {
        msg.sender.call{value: balances[msg.sender]}("");
        balances[msg.sender] = 0;
    }
}

