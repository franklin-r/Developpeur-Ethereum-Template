// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.28;

contract Whitelist {
    mapping (address => bool) whitelist;

    event Authorized(address _address);
    event EthReceived(address _address, uint _value);

    constructor() {
        whitelist[msg.sender] = true;
    }

    receive() external payable {
        emit EthReceived(msg.sender, msg.value);
    }

    fallback() external payable {
        emit EthReceived(msg.sender, msg.value);
    }

    modifier check() {
        require(whitelist[msg.sender], "You are not allowed to whitelist an address.");
        _;
    }

    function authorize(address _address) public check {
        whitelist[_address] = true;
        emit Authorized(_address);
    }
}
