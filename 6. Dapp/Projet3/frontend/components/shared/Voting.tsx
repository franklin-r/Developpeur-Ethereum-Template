"use client";

import Information from "./Information";
import Action from "./Action";
import Event from "./Event";

import { useState, useCallback, useEffect } from "react";

import { useAccount } from "wagmi";

import { contractAddress, WorkflowStatus } from "@/constants";

import { StatusProvider } from "@/contexts/StatusProvider";

import { parseAbiItem } from "viem";

import {publicClient} from "@/utils/client";

export type VoteEvent = {
	type: "VoterRegistered" | "ProposalRegistered" | "Voted" | "WorkflowStatusChange";
	voterAddr: string | undefined;
	proposalId: bigint | undefined;
	prevStatus: WorkflowStatus | undefined | null;
	newStatus: WorkflowStatus | undefined | null;
	blockNumber: number;
};

const Voting = () => {

	const {address} = useAccount();
	const [events, setEvents] = useState<VoteEvent[]>([])
	const [loadingEvents, setLoadingEvents] = useState(false);

	const getEvents = useCallback(async() => {
		setLoadingEvents(true);
		try {
			const voterRegisteredEvents = await publicClient.getLogs({
				address: contractAddress,
				event: parseAbiItem('event VoterRegistered(address voterAddress)'),
				fromBlock: 0n,
				toBlock: 'latest'
			});
			const proposalRegisteredEvents = await publicClient.getLogs({
				address: contractAddress,
				event: parseAbiItem('event ProposalRegistered(uint proposalId)'),
				fromBlock: 0n,
				toBlock: 'latest'
			});
			const votedEvents = await publicClient.getLogs({
				address: contractAddress,
				event: parseAbiItem('event Voted(address voter, uint proposalId)'),
				fromBlock: 0n,
				toBlock: 'latest'
			});
			const workflowStatusChangeEvents = await publicClient.getLogs({
				address: contractAddress,
				event: parseAbiItem('event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus)'),
				fromBlock: 0n,
				toBlock: 'latest'
			});
			const combinedEvents: VoteEvent[] = [
				...voterRegisteredEvents.map((event) => ({
						type: 'VoterRegistered' as const,
						voterAddr: event.args.voterAddress?.toString() || "",
						blockNumber: Number(event.blockNumber),
						proposalId: undefined,
						prevStatus: undefined,
						newStatus: undefined
				})),
				...proposalRegisteredEvents.map((event) => ({
						type: 'ProposalRegistered' as const,
						proposalId: event.args.proposalId || 0n,
						blockNumber: Number(event.blockNumber),
						voterAddr: undefined,
						prevStatus: undefined,
						newStatus: undefined
				})),
				...votedEvents.map((event) => ({
						type: 'Voted' as const,
						voterAddr: event.args.voter?.toString() || "",
						proposalId: event.args.proposalId || 0n,
						blockNumber: Number(event.blockNumber),
						prevStatus: undefined,
						newStatus: undefined
				})),
				...workflowStatusChangeEvents.map((event) => ({
						type: 'WorkflowStatusChange' as const,
						prevStatus: event.args.previousStatus as WorkflowStatus || null,
						newStatus: event.args.newStatus as WorkflowStatus || null,
						blockNumber: Number(event.blockNumber),
						voterAddr: undefined,
						proposalId: undefined
				}))
			];
			const sortedEvents = combinedEvents.sort((a, b) => b.blockNumber - a.blockNumber);
				setEvents(sortedEvents);
				console.log(events);
			} catch {
				setEvents([]);
			} finally {
				setLoadingEvents(false);
			}
	}, [address]);

	useEffect(() => {
		getEvents();
	}, [getEvents]);
	
	return (
		<StatusProvider>
			<div className="mb-5">
				<Information />
			</div>
			<div className="mb-5">
				<Action getEvents={getEvents} />
			</div>
			<div className="mb-5">
				<Event events={events}/>
			</div>
		</StatusProvider>
	);
}

export default Voting;