// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.28;

error NumberOutOfRange();

contract SimpleStorage {

    event NumberChanged(address indexed by, uint number);

    mapping(address => uint) private addressToNumber;

    function setNumber(uint _number) public {
        if(_number >= 10) {
            revert NumberOutOfRange();
        }
        addressToNumber[msg.sender] = _number;
        emit NumberChanged(msg.sender, _number);
    }

    function getNumber() public view returns (uint) {
        return addressToNumber[msg.sender];
    }
}
