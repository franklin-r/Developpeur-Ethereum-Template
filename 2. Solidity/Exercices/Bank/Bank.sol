// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.28;

contract Bank {
    mapping (address => uint) private _balances;

    modifier notAddrZero(address _address) {
        require(_address != address(0), "You cannot do a transfer to address 0x0.");
        _;
    }

    modifier enoughBalance(uint _amount) {
        require(_amount <= _balances[msg.sender], "Your balance is insufficient for this transfer.");
        _;
    }

    constructor() {
        _balances[msg.sender] += 1000;
    }

    function balanceOf(address _address) external view returns (uint) {
        return _balances[_address];
    }
 
    function deposit(uint _amount) external {
        _balances[msg.sender] += _amount;
    }

    function transfer(address _recipient, uint _amount) external notAddrZero(_recipient) enoughBalance(_amount) {
        // No need to check for underflow: _amount <= _balances[msg.sender]
        unchecked {
            _balances[msg.sender] -= _amount;
        }
        _balances[_recipient] += _amount;
    }
}
