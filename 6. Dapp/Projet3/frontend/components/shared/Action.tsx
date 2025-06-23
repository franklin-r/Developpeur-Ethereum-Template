"use client";

import AddVoter from "./AddVoter";
import AddProposal from "./AddProposal";
import SetVote from "./SetVote";
import TallyVotes from "./TallyVotes";
import NextStage from "./NextStage";

import { useAccount } from "wagmi";

import { useStatusContext } from "@/contexts/StatusProvider";

import { contractAdmin, WorkflowStatus } from "@/constants";

const Action = ({getEvents}: {getEvents: () => void}) => {

	const {address} = useAccount();
	const {status} = useStatusContext();

	return (
		<>
			{address === contractAdmin && (
				<div>
					<div className="mb-5"><NextStage getEvents={getEvents} /></div>
					{status === WorkflowStatus.RegisteringVoters && (
						<div className="mb-5"><AddVoter getEvents={getEvents} /></div>
					)}
				</div>
			)}
			{status === WorkflowStatus.ProposalsRegistrationStarted && (
				<div className="mb-5"><AddProposal getEvents={getEvents} /></div>
			)}
			{status === WorkflowStatus.VotingSessionStarted && (
				<div className="mb-5"><SetVote getEvents={getEvents} /></div>
			)}
			{address === contractAdmin && status === WorkflowStatus.VotingSessionEnded && (
				<div className="mb-5"><TallyVotes getEvents={getEvents} /></div>
			)}
		</>
	)
}

export default Action;