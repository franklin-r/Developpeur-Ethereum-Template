// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Voting Smart Contract
/// @author Alyra / Alexis Rossi
/// @notice Implements a voting system with multiple workflow steps
/// @dev Only the contract owner can manage the voting workflow
contract Voting is Ownable {

	/// @notice ID of the winning proposal
	uint public winningProposalID;

	/// @notice Structure storing information about a voter
	struct Voter {
		bool isRegistered;
		bool hasVoted;
		uint votedProposalId;
	}

	/// @notice Structure storing information about a proposal
	struct Proposal {
		string description;
		uint voteCount;
	}

	/// @notice Enumeration of the voting workflow states
	enum WorkflowStatus {
		RegisteringVoters,
		ProposalsRegistrationStarted,
		ProposalsRegistrationEnded,
		VotingSessionStarted,
		VotingSessionEnded,
		VotesTallied
	}

	/// @notice Current workflow status
	WorkflowStatus public workflowStatus;

	Proposal[] proposalsArray;
	mapping(address => Voter) voters;

	/// @notice Emitted when a new voter is registered
	/// @param voterAddress Address of the registered voter
	event VoterRegistered(address voterAddress);

	/// @notice Emitted when the workflow status changes
	/// @param previousStatus Previous workflow status
	/// @param newStatus New workflow status
	event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

	/// @notice Emitted when a new proposal is registered
	/// @param proposalId ID of the newly registered proposal
	event ProposalRegistered(uint proposalId);

	/// @notice Emitted when a voter has voted
	/// @param voter Address of the voter
	/// @param proposalId ID of the proposal voted for
	event Voted(address voter, uint proposalId);

	/// @notice Constructor sets the initial owner
	/// @dev Inherits from OpenZeppelin Ownable
	constructor() Ownable(msg.sender) {}

	/// @notice Modifier to restrict access to registered voters only
	modifier onlyVoters() {
		require(voters[msg.sender].isRegistered, "You're not a voter");
		_;
	}

	/// @notice Returns a voter's information
	/// @param _addr Address of the voter
	/// @return The voter's registration, vote status, and voted proposal
	function getVoter(address _addr) external view onlyVoters returns (Voter memory) {
		return voters[_addr];
	}

	/// @notice Returns a specific proposal
	/// @param _id ID of the proposal
	/// @return The proposal's description and vote count
	function getOneProposal(uint _id) external view onlyVoters returns (Proposal memory) {
		return proposalsArray[_id];
	}

	/// @notice Registers a new voter
	/// @dev Can only be called during the RegisteringVoters phase
	/// @param _addr Address of the voter to register
	function addVoter(address _addr) external onlyOwner {
		require(workflowStatus == WorkflowStatus.RegisteringVoters, "Voters registration is not open yet");
		require(!voters[_addr].isRegistered, "Already registered");
		voters[_addr].isRegistered = true;
		emit VoterRegistered(_addr);
	}

	/// @notice Submits a new proposal
	/// @dev Can only be called during ProposalsRegistrationStarted by registered voters
	/// @param _desc Description of the proposal
	function addProposal(string calldata _desc) external onlyVoters {
		require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Proposals are not allowed yet");
		require(bytes(_desc).length > 0, "Empty proposal");

		Proposal memory proposal;
		proposal.description = _desc;
		proposalsArray.push(proposal);
		emit ProposalRegistered(proposalsArray.length - 1);
	}

	/// @notice Casts a vote for a specific proposal
	/// @dev Can only be called once per voter during VotingSessionStarted
	/// @param _id ID of the proposal to vote for
	function setVote(uint _id) external onlyVoters {
		require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session hasn't started yet");
		require(!voters[msg.sender].hasVoted, "You have already voted");
		require(_id < proposalsArray.length, "Proposal not found");

		voters[msg.sender].votedProposalId = _id;
		voters[msg.sender].hasVoted = true;
		proposalsArray[_id].voteCount++;

		if (proposalsArray[_id].voteCount > proposalsArray[winningProposalID].voteCount) {
				winningProposalID = _id;
		}

		emit Voted(msg.sender, _id);
	}

	/// @notice Starts the proposal registration phase
	/// @dev Only callable by the owner during RegisteringVoters
	function startProposalsRegistering() external onlyOwner {
		require(workflowStatus == WorkflowStatus.RegisteringVoters, "Registering proposals can't be started now");
		workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

		Proposal memory proposal;
		proposal.description = "GENESIS";
		proposalsArray.push(proposal);

		emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
	}

	/// @notice Ends the proposal registration phase
	/// @dev Only callable by the owner during ProposalsRegistrationStarted
	function endProposalsRegistering() external onlyOwner {
		require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Proposal registration hasn't started yet");
		workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
		emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
	}

	/// @notice Starts the voting session
	/// @dev Only callable by the owner during ProposalsRegistrationEnded
	function startVotingSession() external onlyOwner {
		require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, "Proposal registration phase is not finished");
		workflowStatus = WorkflowStatus.VotingSessionStarted;
		emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
	}

	/// @notice Ends the voting session
	/// @dev Only callable by the owner during VotingSessionStarted
	function endVotingSession() external onlyOwner {
		require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session hasn't started yet");
		workflowStatus = WorkflowStatus.VotingSessionEnded;
		emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
	}

	/// @notice Tallies the votes and determines the winning proposal
	/// @dev Only callable by the owner after the voting session ends
	function tallyVotes() external onlyOwner {
		require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
		workflowStatus = WorkflowStatus.VotesTallied;
		emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
	}
}