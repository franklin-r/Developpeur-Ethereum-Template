// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.30;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract VotingPlus is Ownable {

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    error WrongStatus(WorkflowStatus _status);
    error NotRegistered(address _addr);
    error AlreadyExistingProposal(string _description);
    error AlreadyVoted(address _addr);
    error UnexistingProposalId(uint _proposalId);
    error DidntVoteYet(address _addr);
    error WorkflowFinished();
    error NoWinnerFound();

    uint private winningProposalId;
    mapping (address => Voter) public registeredVoters;
    Proposal[] public proposals;
    mapping (string => bool) private existingProposals;
    WorkflowStatus public currentStatus;

    modifier checkStatus(WorkflowStatus _status) {
        require(_status == currentStatus, WrongStatus(_status));
        _;
    }

    modifier checkVoterRegistration(address _addr) {
        require(registeredVoters[_addr].isRegistered, NotRegistered(_addr));
        _;
    }

    constructor() Ownable(msg.sender) { }

    function registerVoter(address _addr) external onlyOwner() checkStatus(WorkflowStatus.RegisteringVoters) {
        registeredVoters[_addr] = Voter(true, false, 0);
        emit VoterRegistered(_addr);
    }

    function advanceStatus() public onlyOwner() {
        require(currentStatus != WorkflowStatus.VotesTallied, WorkflowFinished());
        WorkflowStatus previousStatus = currentStatus;
        currentStatus = WorkflowStatus((uint(currentStatus) + 1));
        emit WorkflowStatusChange(previousStatus, currentStatus);
    }

    function registerProposal(string calldata _description) external checkStatus(WorkflowStatus.ProposalsRegistrationStarted) checkVoterRegistration(msg.sender) {
        require(!existingProposals[_description], AlreadyExistingProposal(_description));
        proposals.push(Proposal(_description, 0));
        existingProposals[_description] = true;
        emit ProposalRegistered(proposals.length - 1);
    }

    function vote(uint _proposalId) external checkStatus(WorkflowStatus.VotingSessionStarted) checkVoterRegistration(msg.sender) {
        require(!registeredVoters[msg.sender].hasVoted, AlreadyVoted(msg.sender));
        require(_proposalId < proposals.length, UnexistingProposalId(_proposalId));
        proposals[_proposalId].voteCount += 1;
        registeredVoters[msg.sender].hasVoted = true;
        registeredVoters[msg.sender].votedProposalId = _proposalId;
        emit Voted(msg.sender, _proposalId);
    }

    function tallyVotes() external onlyOwner() checkStatus(WorkflowStatus.VotingSessionEnded) {
        for (uint i = 1; i < proposals.length; i++) {
            if (proposals[i].voteCount > proposals[winningProposalId].voteCount) {
                winningProposalId = i;
            }
        }
        advanceStatus();
    }

    function getWinner() external view checkStatus(WorkflowStatus.VotesTallied) returns (string memory) {
        require(proposals.length != 0, NoWinnerFound());
        return proposals[winningProposalId].description;
    }

    function consultVote(address _addr) external view checkVoterRegistration(msg.sender) returns (uint) {
        require(registeredVoters[msg.sender].hasVoted, DidntVoteYet(_addr));
        return registeredVoters[_addr].votedProposalId;
    }
}
