// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Bank is Ownable {

    event Deposit(address indexed _from, uint _value);
    event Withdraw(address indexed _from, uint _value);

    constructor() Ownable(msg.sender) { }

    function deposit() external payable onlyOwner() {
        require(msg.value > 0.1 ether, "Not enough funds provided");
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint _value) external onlyOwner() {
        require(_value < address(this).balance, "You cannot withdraw this amount");
        (bool success, ) = msg.sender.call{value: _value}("");
        require(success, "The withdrawal did not work");
        emit Withdraw(msg.sender, _value);
    }
}
