"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";

import { BaseError, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

import { useEffect } from "react";

import { contractAbi, contractAddress, contractAdmin, WorkflowStatus } from "@/constants";
import { useStatusContext } from "@/contexts/StatusProvider";

const NextStage = ({getEvents}: {getEvents: () => void}) => {

	const {address} = useAccount();
	const {status} = useStatusContext();

	const {data: hash, error, isPending, writeContract} = useWriteContract();
	const {isLoading, isSuccess, error: errorConfirmation} = useWaitForTransactionReceipt({
		hash	// Transaction's hash to watch (string)
	})

	useEffect(() => {
		if (isSuccess) {
			toast.success(`Transaction confirmed: ${hash}`);
			refetchEverything();
		}
		if (errorConfirmation) {
			toast.error("Transaction failed.");
		}
		if (isLoading) {
			toast.info("Waiting for block confirmation.");
		}
		if (error) {
			toast.error(`Transaction cancelled: ${(error as BaseError).shortMessage || error.message}`);
		}
	}, [isSuccess, errorConfirmation, isLoading, error]);

	const refetchEverything = async () => {
		await getEvents();
	}

	const handleMoveToNextStage = async () => {
		let functionName: string;

		switch (status as WorkflowStatus) {
			case WorkflowStatus.RegisteringVoters:
				functionName = "startProposalsRegistering";
				break;
			case WorkflowStatus.ProposalsRegistrationStarted:
				functionName = "endProposalsRegistering";
				break;
			case WorkflowStatus.ProposalsRegistrationEnded:
				functionName = "startVotingSession";
				break;
			case WorkflowStatus.VotingSessionStarted:
				functionName = "endVotingSession";
				break;
			default:
				functionName = "";
				break;
		}
		if (functionName === "") {
			return;
		}
		writeContract({
			address: contractAddress,
			abi: contractAbi,
			functionName: functionName,
			account: address
		});
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Move To Next Stage</CardTitle>
				<CardDescription>Move on in the vote process.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex w-full max-w-md items-center gap-2">
					<Button variant="outline"
									onClick={handleMoveToNextStage}
									disabled={(address !== contractAdmin) || isPending || isLoading}
					>
						Move
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

export default NextStage;