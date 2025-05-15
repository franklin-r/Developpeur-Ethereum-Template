// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Admin is Ownable {

    mapping (address => bool) private whitelist;
    mapping (address => bool) private blacklist;

    event Whitelisted(address _addr);
    event Blacklisted(address _addr);

    modifier alreadyWhiteListed(address _addr) {
        require(!whitelist[_addr], "This address is already whitelisted.");
        _;
    }

    modifier alreadyBlackListed(address _addr) {
        require(!blacklist[_addr], "This address is already blacklisted.");
        _;
    }

    constructor() Ownable(msg.sender) { }

    function whitelistFunction(address _addr) public onlyOwner alreadyWhiteListed(_addr) alreadyBlackListed(_addr) {
        whitelist[_addr] = true;
        emit Whitelisted(_addr);
    }

    function blacklistFunction(address _addr) public onlyOwner alreadyBlackListed(_addr) alreadyWhiteListed(_addr) {
        blacklist[_addr] = true;
        emit Blacklisted(_addr);
    }

    function isWhiteListed(address _addr) public view returns (bool) {
        return whitelist[_addr];
    }

    function isBlackListed(address _addr) public view returns (bool) {
        return blacklist[_addr];
    }

}
