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

import { contractAbi, contractAddress, contractAdmin } from "@/constants";

const AddVoter = ({getEvents}: {getEvents: () => void}) => {

	const [newAddr, setNewAddr] = useState<string>("");
	const [inputError, setInputError] = useState<string | null>(null);
	const {address} = useAccount();

	const {data: hash, error, isPending, writeContract} = useWriteContract();
	const {isLoading, isSuccess, error: errorConfirmation} = useWaitForTransactionReceipt({
		hash	// Transaction's hash to watch (string)
	})

	useEffect(() => {
		if (newAddr && !isAddress(newAddr)) {
			setInputError("Please enter a valid Ethereum address.")
		}
		else {
			setInputError(null);
		}
	}, [newAddr]);

	useEffect(() => {
		if (isSuccess) {
			setNewAddr("");
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

	const handleAddVoter = async () => {
		if (!newAddr || !isAddress(newAddr)) {
			setInputError("Please enter a valid Ethereum address.");
			return;
		}
		writeContract({
			address: contractAddress,
			abi: contractAbi,
			functionName: "addVoter",
			account: address,
			args: [newAddr]
		});
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add Voter</CardTitle>
				<CardDescription>Enter an address to register a voter.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex w-full max-w-md items-center gap-2">
					<Input type="text" placeholder="Address" value={newAddr} onChange={(e) => setNewAddr(e.target.value)}/>
					<Button variant="outline"
									onClick={handleAddVoter}
									disabled={!newAddr || !!inputError || (address !== contractAdmin) || isPending || isLoading}
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

export default AddVoter;