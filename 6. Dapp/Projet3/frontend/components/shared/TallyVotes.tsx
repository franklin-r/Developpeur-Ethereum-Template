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

const TallyVotes = () => {

	const {address} = useAccount();

	const {data: hash, error, isPending, writeContract} = useWriteContract();
	const {isLoading, isSuccess, error: errorConfirmation} = useWaitForTransactionReceipt({
		hash	// Transaction's hash to watch (string)
	})

	useEffect(() => {
		if (isSuccess) {
			toast.success(`Transaction confirmed: ${hash}`);
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

	const handleTallyVotes = async () => {
		writeContract({
			address: contractAddress,
			abi: contractAbi,
			functionName: "tallyVotes",
			account: address
		});
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Tally Votes</CardTitle>
				<CardDescription>Tally votes and decide winning proposal.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex w-full max-w-md items-center gap-2">
					<Button variant="outline"
									onClick={handleTallyVotes}
									disabled={(address !== contractAdmin) || isPending || isLoading}
					>
						Tally
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

export default TallyVotes;