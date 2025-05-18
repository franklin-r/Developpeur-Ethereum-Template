// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.30;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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
    error DoesntHaveGovernanceToken(address _addr);
    error NotEnoughGovernanceToken(address _addr);

    uint[] private winningProposalIds;
    mapping (address => Voter) public registeredVoters;
    address[] private registeredVotersAddr; // Track registered addresses to reset the corresponding mapping when wanted
    Proposal[] public proposals;
    mapping (string => bool) private existingProposals; // Track existing proposals to avoid duplicates
    WorkflowStatus public currentStatus;
    IERC20 public governanceToken;

    modifier checkStatus(WorkflowStatus _status) {
        require(_status == currentStatus, WrongStatus(_status));
        _;
    }

    modifier checkVoterRegistration(address _addr) {
        require(registeredVoters[_addr].isRegistered, NotRegistered(_addr));
        _;
    }

    modifier checkGovernanceTokenBalance(address _addr) {
        require(governanceToken.balanceOf(_addr) > 0, DoesntHaveGovernanceToken(_addr));
        _;
    }

    constructor(address _tokenAddress) Ownable(msg.sender) {
        governanceToken = IERC20(_tokenAddress);
    }

    function registerVoter(address _addr) external onlyOwner() checkStatus(WorkflowStatus.RegisteringVoters) checkGovernanceTokenBalance(_addr) {
        registeredVoters[_addr] = Voter(true, false, 0);
        registeredVotersAddr.push(_addr);
        emit VoterRegistered(_addr);
    }

    function advanceStatus() public onlyOwner() {
        require(currentStatus != WorkflowStatus.VotesTallied, WorkflowFinished());
        WorkflowStatus previousStatus = currentStatus;
        currentStatus = WorkflowStatus((uint(currentStatus) + 1));
        emit WorkflowStatusChange(previousStatus, currentStatus);
    }

    function registerProposal(string calldata _description) external checkStatus(WorkflowStatus.ProposalsRegistrationStarted) checkVoterRegistration(msg.sender) {
        require(governanceToken.balanceOf(msg.sender) * 100 / governanceToken.totalSupply() >= 1, NotEnoughGovernanceToken(msg.sender));    // Requires 1% of total supply to make a proposal
        require(!existingProposals[_description], AlreadyExistingProposal(_description));
        proposals.push(Proposal(_description, 0));
        existingProposals[_description] = true;
        emit ProposalRegistered(proposals.length - 1);
    }

    function vote(uint _proposalId) external checkStatus(WorkflowStatus.VotingSessionStarted) checkVoterRegistration(msg.sender) checkGovernanceTokenBalance(msg.sender) {
        require(!registeredVoters[msg.sender].hasVoted, AlreadyVoted(msg.sender));
        require(_proposalId < proposals.length, UnexistingProposalId(_proposalId));
        proposals[_proposalId].voteCount += governanceToken.balanceOf(msg.sender);
        registeredVoters[msg.sender].hasVoted = true;
        registeredVoters[msg.sender].votedProposalId = _proposalId;
        emit Voted(msg.sender, _proposalId);
    }

    function tallyVotes() external onlyOwner() checkStatus(WorkflowStatus.VotingSessionEnded) {
        winningProposalIds.push(0);
        for (uint i = 1; i < proposals.length; i++) {
            if (proposals[i].voteCount == proposals[winningProposalIds[0]].voteCount) {
                winningProposalIds.push(i);
            }
            else if (proposals[i].voteCount > proposals[winningProposalIds[0]].voteCount) {
                delete winningProposalIds;
                winningProposalIds.push(i);
            }
        }
        advanceStatus();
    }

    function getWinner() external view checkStatus(WorkflowStatus.VotesTallied) returns (string[] memory) {
        require(proposals.length != 0, NoWinnerFound());
        uint nWinningProposals = winningProposalIds.length;
        string[] memory winningProposals = new string[](nWinningProposals);
        for(uint i = 0; i < nWinningProposals; i++) {
            winningProposals[i] = proposals[winningProposalIds[i]].description;
        }
        return winningProposals;
    }

    function consultVote(address _addr) external view checkVoterRegistration(msg.sender) returns (uint) {
        require(registeredVoters[msg.sender].hasVoted, DidntVoteYet(_addr));
        return registeredVoters[_addr].votedProposalId;
    }

    function resetWorkflow() external onlyOwner() checkStatus(WorkflowStatus.VotesTallied) {
        delete winningProposalIds;
        currentStatus = WorkflowStatus.RegisteringVoters;
        for (uint i = 0; i < proposals.length; i++) {
            existingProposals[proposals[i].description] = false;
        }
        for (uint i = 0; i < registeredVotersAddr.length; i++) {
            registeredVoters[registeredVotersAddr[i]] = Voter(false, false, 0);
        } 
        delete proposals;
    }
}
