"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { contractAddress, contractAbi, WorkflowStatus } from "@/constants";

import { useAccount, useReadContract } from "wagmi";

import { useStatusContext } from "@/contexts/StatusProvider";

const WinnerInformation = () => {

	const {address} = useAccount();
	const {status} = useStatusContext();
	
	const {data, isPending} = useReadContract({
		address: contractAddress,
		abi: contractAbi,
		functionName: "winningProposalID",
		account: address
	})

	return (
		<Card className="text-center min-h-[200px]">
			<CardHeader>
				<CardTitle>Winning Proposal</CardTitle>
			</CardHeader>
			<CardContent>
				<div>
					{!isPending && status && status === WorkflowStatus.VotesTallied ? (
						data?.toString()
					) : (
						"Loading..."
					)}
				</div>
			</CardContent>
		</Card>
	)
}

export default WinnerInformation;