"use client";

import AddVoter from "./AddVoter";
import AddProposal from "./AddProposal";
import SetVote from "./SetVote";
import TallyVotes from "./TallyVotes";
import NextStage from "./NextStage";

import { useAccount } from "wagmi";

import { contractAdmin } from "@/constants";

const Action = () => {

	const {address} = useAccount();

	return (
		<>
			{address === contractAdmin && (
				<div>
					<div className="mb-5"><NextStage /></div>
					<div className="mb-5"><AddVoter /></div>
				</div>
			)}
			<div className="mb-5"><AddProposal /></div>
			<div className="mb-5"><SetVote /></div>
			{address === contractAdmin && (
				<div className="mb-5"><TallyVotes /></div>
			)}
		</>
	)
}

export default Action;