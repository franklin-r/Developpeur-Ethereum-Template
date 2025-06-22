"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { contractAddress, contractAbi } from "@/constants";

import { useAccount, useReadContract } from "wagmi";

const WinnerInformation = () => {

	const {address} = useAccount();
	
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
					{isPending ? (
						"Loading..."
					) : (
						data?.toString()
					)}
				</div>
			</CardContent>
		</Card>
	)
}

export default WinnerInformation;