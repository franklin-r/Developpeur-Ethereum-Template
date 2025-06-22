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

import { isAddress } from "viem";

import { BaseError, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

import { useState, useEffect } from "react";

import { contractAbi, contractAddress } from "@/constants";

const AddProposal = () => {

	const [newProposal, setNewProposal] = useState<string>("");
	const [inputError, setInputError] = useState<string | null>(null);
	const {address} = useAccount();

	const {data: hash, error, isPending, writeContract} = useWriteContract();
	const {isLoading, isSuccess, error: errorConfirmation} = useWaitForTransactionReceipt({
		hash	// Transaction's hash to watch (string)
	})

	useEffect(() => {
		if (newProposal && newProposal.trim().length === 0) {
			setInputError("Please enter a valid proposal.")
		}
		else {
			setInputError(null);
		}
	}, [newProposal]);

	useEffect(() => {
		if (isSuccess) {
			setNewProposal("");
		}
	}, [isSuccess]);

	useEffect(() => {
		if (isSuccess) {
			toast.success(`Transaction confirmed: ${hash}`)
		}
		if (errorConfirmation) {
			toast.error("Transaction failed.")
		}
		if (isLoading) {
			toast.info("Waiting for block confirmation.")
		}
		if (error) {
			toast.error(`Transaction cancelled: ${(error as BaseError).shortMessage || error.message}`)
		}
	}, [isSuccess, errorConfirmation, isLoading, error]);

	const handleAddProposal = async () => {
		if (!newProposal || newProposal.trim().length === 0) {
			setInputError("Please enter a valid proposal.");
			return;
		}
		writeContract({
			address: contractAddress,
			abi: contractAbi,
			functionName: "addProposal",
			account: address,
			args: [newProposal]
		});
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add Proposal</CardTitle>
				<CardDescription>Enter a new proposal.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex w-full max-w-md items-center gap-2">
					<Input type="text" placeholder="Proposal" value={newProposal} onChange={(e) => setNewProposal(e.target.value)}/>
					<Button variant="outline"
									onClick={handleAddProposal}
									disabled={!newProposal || !!inputError || isPending || isLoading}
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

export default AddProposal;