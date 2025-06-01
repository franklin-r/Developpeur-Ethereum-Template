// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.30;

contract Auction {
    address highestBidder;
    uint highestBid;

    function bid() payable public {
        require(msg.value >= highestBid);

        if (highestBidder != address(0)) {
            (bool success, ) = highestBidder.call{value: highestBid}("");
            require(success);
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
    }
}
