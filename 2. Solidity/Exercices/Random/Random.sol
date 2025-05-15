// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.28;

contract Random {
    uint private nonce;

    function random() public returns (uint) {
        nonce += 1;
        return uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 100;
    }
}
