// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.28;


contract SimpleStorage {

    error NumberTooBig(uint _number);

    event NumberChanged(uint _number);

    modifier checkNumberLessThanTen(uint _number) {
        require(_number < 10, NumberTooBig(_number));
        _;
    }

    constructor(uint _number) {
        number = _number;
    }

    uint private number;    // slot 0
    //uint private number2; // slot 1

    function setNumber(uint _number) external checkNumberLessThanTen(_number) {
        number = _number;
        emit NumberChanged(_number);
    }

    function getNumber() external view returns (uint) {
        return number;
    }

    function increment() external {
        number += 1;
        emit NumberChanged(number);
    }
}
