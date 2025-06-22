"use client";

import Information from "./Information";
import Action from "./Action";
import Event from "./Event";

import {publicClient} from "@/utils/client";
import { contractAddress, contractAbi, WorkflowStatus } from "@/constants";
import { StatusContext } from "@/contexts/StatusContext";
import { StatusProvider } from "@/contexts/StatusProvider";

import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

import { ParseAbiItem } from "viem";

const Voting = () => {

	const {address} = useAccount();

	const {data, isPending: isStatusPending, isSuccess: isStatusSuccess, refetch} = useReadContract({
		address: contractAddress,
		abi: contractAbi,
		functionName: "workflowStatus",
		account: address
	})
	
	return (
		<StatusProvider>
			<div className="mb-5">
				<Information />
			</div>
			<div className="mb-5">
				<Action />
			</div>
			<div className="mb-5">
				<Event />
			</div>
		</StatusProvider>
	);
}

export default Voting;