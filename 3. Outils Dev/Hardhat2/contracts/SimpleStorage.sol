// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

contract SimpleStorage {
    uint256 private favoriteNumber;

    constructor(uint256 _favoriteNumber) {
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }
}   