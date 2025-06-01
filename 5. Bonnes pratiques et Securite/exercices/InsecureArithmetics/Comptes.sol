// SPDX-License-Identifier: MIT

pragma solidity 0.8.30;

contract Comptes {

    uint8 constant max = 200;
    mapping (address => uint8) comptes;

    function borrow(uint8 _amount) public {
        // Here, comptes[msg.sender] + _amount can overflow, in which case it is set to 0.
        // Therefore, it'd be less than 0 and you can keep borrowing past the limit.
        require (comptes[msg.sender] + _amount <= max, "tu retires trop");

        (bool sent, ) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send Ether");      
    
        // Same reasoning, it would set your borrowing balance back to 0 if overflowing.
        comptes[msg.sender] += _amount;
    }

    function refund() payable public {
        // msg.value will be truncated if greater than max value of uint8
        // comptes[msg.sender] - uint8(msg.value) can also underflow,
        // in which case it would set the result to the biggest uint8 value.
        require(comptes[msg.sender] - uint8(msg.value) >= 0, "tu rends trop");

        // Same reasoning, could actually increase tje borrowing balance will paying back.
        comptes[msg.sender] -= uint8(msg.value);
    }

    function getBorrowBalance(address _addr) external view returns (uint8) {
        return comptes[_addr];
    }
}
