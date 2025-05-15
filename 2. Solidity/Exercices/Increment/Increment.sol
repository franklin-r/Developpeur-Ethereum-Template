// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.28;

contract Increment {

    address private addr;

    error TransferFailed(address _addr, uint _value);
    error InsufficientBalance(address _addr, uint _value);

    modifier notAddrZero(address _addr) {
        require(_addr != address(0), "You cannot set the address to the address 0x0.");
        _;
    }

    modifier minimumValue(address _to, uint _value) {
        require(_value >= 1 wei, InsufficientBalance(_to, _value));
        _;
    }

    function setAddr(address _addr) external notAddrZero(_addr) {
        addr = _addr;
    }

    function getBalance() external view returns (uint) {
        return addr.balance;
    }

    function balanceOf(address _addr) external view returns (uint) {
        return _addr.balance;
    }

    function transferWithCall(address payable _to) public payable notAddrZero(_to) minimumValue(_to, msg.value) {
        (bool success, ) = _to.call{value: msg.value}("");
        require(success, TransferFailed(_to, msg.value));
    }

    function transferWithSend(address payable _to) external payable notAddrZero(_to) minimumValue(_to, msg.value) {
        bool success = _to.send(msg.value);
        require(success, TransferFailed(_to, msg.value));
    } 

    function transferWithTransfer(address payable _to) external payable notAddrZero(_to) minimumValue(_to, msg.value) {
        _to.transfer(msg.value);
    }

    function conditionnalTransfer(uint _value) external payable minimumValue(addr, _value){
        require(addr.balance > _value, InsufficientBalance(addr, _value));
        (bool success, ) = addr.call{value: _value}("");
        require(success, TransferFailed(addr, _value));
    }
}


