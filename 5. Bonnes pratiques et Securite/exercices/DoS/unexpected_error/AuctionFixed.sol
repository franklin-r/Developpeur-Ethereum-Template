// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.30;

contract AuctionFixed {
    address highestBidder;
    uint highestBid;
    mapping(address => uint) public previousHighestBidders;

    function bid() external payable {
        require(msg.value >= highestBid);
        if (highestBidder != address(0)) {
            previousHighestBidders[highestBidder] += highestBid;
        }
        highestBidder = msg.sender;
        highestBid = msg.value;
    }

    function reimburse() external {
        require(previousHighestBidders[msg.sender] != 0, "You have no bid to get reimbursed");
        uint tmpPreviousHighestBid = previousHighestBidders[msg.sender];
        previousHighestBidders[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: tmpPreviousHighestBid}("");
        require(success, "Reimbursement failed");
    }
}
