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

import { contractAddress, contractAbi } from "@/constants";

const ProposalsInformation = () => {

	const [proposalId, setProposalId] = useState<string>("");
	const [inputError, setInputError] = useState<string | null>(null);
	const {address} = useAccount();
	const {data, isLoading, isSuccess, error, refetch} = useReadContract({
		address: contractAddress,
		abi: contractAbi,
		functionName: "getOneProposal",
		account: address,
		args: [proposalId],
		query: {
			enabled: false	
		}
	});
	const proposal = data as {
		description: string;
		voteCount: bigint;
	};

	useEffect(() => {
		if (proposalId && isNaN(Number(proposalId)) || Number(proposalId) < 0) {
			setInputError("Please enter a valid proposal ID.")
		}
		else {
			setInputError(null);
		}
	}, [proposalId]);

	const handleGetOneProposal = async () => {
		if (proposalId) {
			await refetch();
		}
	}

	return (
		<Card className="min-h-[200px]">
			<CardHeader>
				<CardTitle>Proposal's Informations</CardTitle>
				<CardDescription>Enter a proposal's ID to check its informations.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex w-full gap-4">
					<div className="w-1/2 flex flex-col gap-2">
						<div className="flex w-full items-center gap-2">
							<Input
								type="text"
								placeholder="ID"
								value={proposalId}
								onChange={(e) => setProposalId(e.target.value)}
							/>
							<Button
								variant="outline"
								onClick={handleGetOneProposal}
								disabled={!proposalId || !!inputError}
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
								<p>Description: {proposal.description}</p>
								<p>Vote Count: {proposal.voteCount.toString()}</p>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default ProposalsInformation;