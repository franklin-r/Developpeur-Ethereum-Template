"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

import { BaseError, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

import { useState, useEffect } from "react";

import { contractAbi, contractAddress } from "@/constants";

const SetVote = ({getEvents}: {getEvents: () => void}) => {

	const [proposalId, setProposalId] = useState<string>("");
	const [inputError, setInputError] = useState<string | null>(null);
	const {address} = useAccount();

	const {data: hash, error, isPending, writeContract} = useWriteContract();
	const {isLoading, isSuccess, error: errorConfirmation} = useWaitForTransactionReceipt({
		hash	// Transaction's hash to watch (string)
	})

	useEffect(() => {
		if (proposalId && isNaN(Number(proposalId)) || Number(proposalId) < 0) {
			setInputError("Please enter a valid proposal ID.")
		}
		else {
			setInputError(null);
		}
	}, [proposalId]);

	useEffect(() => {
		if (isSuccess) {
			setProposalId("");
		}
	}, [isSuccess]);

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

	const handleSetVote = async () => {
		if (!proposalId || isNaN(Number(proposalId)) || Number(proposalId) < 0) {
			setInputError("Please enter a valid proposal ID.");
			return;
		}
		writeContract({
			address: contractAddress,
			abi: contractAbi,
			functionName: "setVote",
			account: address,
			args: [proposalId]
		});
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Vote</CardTitle>
				<CardDescription>Enter the ID of the proposal you want to vote for.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex w-full max-w-md items-center gap-2">
					<Input type="text" placeholder="ID" value={proposalId} onChange={(e) => setProposalId(e.target.value)}/>
					<Button variant="outline"
									onClick={handleSetVote}
									disabled={!proposalId || !!inputError || isPending || isLoading}
					>
						Add
					</Button>
				</div>
				{!!inputError && (
					<div className="text-red-500">{inputError}</div>
				)}
			</CardContent>
		</Card>
	)
}

export default SetVote;