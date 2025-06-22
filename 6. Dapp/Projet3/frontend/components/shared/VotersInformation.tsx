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

import { useState, useEffect } from "react";

import { useAccount, useReadContract } from "wagmi";

import { isAddress } from "viem";

import { contractAddress, contractAbi } from "@/constants";

const VotersInformation = () => {

	const [voterAddr, setVoterAddr] = useState<string>("");
	const [inputError, setInputError] = useState<string | null>(null);
	const {address} = useAccount();
	const {data, isLoading, isSuccess, error, refetch} = useReadContract({
		address: contractAddress,
		abi: contractAbi,
		functionName: "getVoter",
		account: address,
		args: [voterAddr],
		query: {
			enabled: false	
		}
	});
	const voter = data as {
		isRegistered: boolean;
		hasVoted: boolean;
		votedProposalId: bigint;
	};

	useEffect(() => {
		if (voterAddr && !isAddress(voterAddr)) {
			setInputError("Please enter a valid Ethereum address.")
		}
		else {
			setInputError(null);
		}
	}, [voterAddr]);

	const handleGetVoter = async () => {
		if (voterAddr) {
			await refetch();
		}
	}

	return (
		<Card className="min-h-[200px]">
			<CardHeader>
				<CardTitle>Voter's Informations</CardTitle>
				<CardDescription>Enter a voter's address to check his informations.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex w-full gap-4">
					<div className="w-1/2 flex flex-col gap-2">
						<div className="flex w-full items-center gap-2">
							<Input
								type="text"
								placeholder="Address"
								value={voterAddr}
								onChange={(e) => setVoterAddr(e.target.value)}
							/>
							<Button
								variant="outline"
								onClick={handleGetVoter}
								disabled={!voterAddr || !!inputError}
							>
								Check
							</Button>
						</div>
						{!!inputError && (
							<div className="text-red-500">{inputError}</div>
						)}
						{error && (
							<div className="text-red-500">Could not retrieve information.</div>
						)}
						{isLoading && (
							<div>Loading...</div>
						)}
					</div>
					<div className="w-1/2">
						{isSuccess && (
							<div className="space-y-1">
								<p>Registered: {voter.isRegistered.toString()}</p>
								<p>Has Voted: {voter.hasVoted.toString()}</p>
								<p>Voted Proposal ID: {voter.votedProposalId.toString()}</p>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default VotersInformation;