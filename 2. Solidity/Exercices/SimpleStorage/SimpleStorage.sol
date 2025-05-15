// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.28;

contract SimpleStorage {

    uint256 number;

    function store(uint256 num) external {
        number = num;
    }

    function retrieve() external view returns (uint256){
        return number;
    }
}
