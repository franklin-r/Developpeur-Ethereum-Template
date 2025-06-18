"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RocketIcon, ClockIcon, CheckIcon, AlertCircleIcon } from "lucide-react";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/components/ui/alert"

import Event from "./Event";

import { contractAddress, contractAbi } from "@/constants";

import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

import { parseAbiItem } from "viem";

import { publicClient } from "@/utils/client";

const SimpleStorage = () => {

	const {address} = useAccount();
	const [number, setNumber] = useState(null);
	const [events, setEvents] = useState([]);

	// refetch is a function that re-triggers the retrieveing of the data in the blockchain
	const {data: numberGet, error: getError, isPending: getIsPending, refetch} = useReadContract({
		address: contractAddress,
		abi: contractAbi,
		functionName: 'retrieve',
		account: address
	})

	const {data: hash, error, isPending: setIsPending, writeContract} = useWriteContract({
		/*
		// See tanstack-query docs
		mutation: {
			// What to do if the tansaction has be launched (not accepted, not included in a block,
			// but blockchain got it and is trying to do something with it). Could add a toaster to
			/: let user know that the transaction has been launched.
			onSuccess: () => {
			
			},
			onError: (error) => {
				
			}
		}
		*/
	})

	const setTheNumber = async () => {
		writeContract({
			address: contractAddress,
			abi: contractAbi,
			functionName: "store",
			args: [number]
		})
	}

	const {isLoading: isConfirming, isSuccess, error: errorConfirmation} = useWaitForTransactionReceipt({
		hash
	})

	const refetchEverything = async () => {
		await refetch();
		await getEvents();
	}

	const getEvents = async () => {
		// Retrieve all NumberChanged events
		const numberChangedLog = await publicClient.getLogs({
			address: contractAddress,
			event: parseAbiItem("event NumberChanged(uint oldValue, uint newValue)"),
			// From first block
			fromBlock: 0n,
			// To last block
			toBlock: "latest"
		})
		// Put those events in the "events" state
		setEvents(numberChangedLog.map((log) => ({
				oldValue: log.args.oldValue.toString(),
				newValue: log.args.newValue.toString()
			}) 
		))
	}

	useEffect(() => {
		if (isSuccess) {
			toast.success("Congratulations", {
				description: "Your number has been updated in the blockchain"
			})
			refetchEverything();
		}
		if (errorConfirmation) {
			toast(errorConfirmation.shortMessage, {
				status: "error",
				duration: 3000,
				isClosable: true
			})
		}
	}, [isSuccess, errorConfirmation])

	// Fetch events when someone gets connected
	useEffect(() => {
		const getAllEvents = async () => {
			if (address !== 'undefined') {
				await getEvents();
			}
			getAllEvents();
		}
	}, [address])

	return (
		<div className="flex flex-col w-full">
			<h2 className="mb-4 text-4xl">Get</h2>
			<div>
				{getIsPending ? (
					<div>Loading...</div>
				) : (
					<p>The number in the blockchain: <span className="font-bold">{numberGet?.toString()}</span></p>
				)}
			</div>
			<h2 className="mt-6 mb-4 text-4xl">Set</h2>
			<div className="flex flex-col w-full">
				{hash &&
					<Alert className="mb-4 bg-lime-200">
						<RocketIcon />
						<AlertTitle>Information</AlertTitle>
						<AlertDescription>
							Transaction Hash: {hash}
						</AlertDescription>
					</Alert>
				}
				{isConfirming &&
					<Alert className="mb-4 bg-amber-200">
						<ClockIcon />
						<AlertTitle>Information</AlertTitle>
						<AlertDescription>
							Waiting for confirmation...
						</AlertDescription>
					</Alert>
				}
				{isSuccess &&
					<Alert className="mb-4 bg-lime-200">
						<CheckIcon />
						<AlertTitle>Information</AlertTitle>
						<AlertDescription>
							Transaction confirmed
						</AlertDescription>
					</Alert>
				}
				{errorConfirmation &&
					<Alert className="mb-4 bg-red-400">
						<AlertIcon />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>
							{(errorConfirmation.shortMessage || errorConfirmation.message)}
						</AlertDescription>
					</Alert>
				}
				{error &&
					<Alert className="mb-4 bg-red-400">
						<AlertCircleIcon />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>
							{(error.shortMessage || error.message)}
						</AlertDescription>
					</Alert>
				}
			</div>
			<div className="flex">
				<Input placeholder="Your number" onChange={(e) => setNumber(e.target.value)} />
				<Button variant="outline" disabled={setIsPending} onClick={setTheNumber}>{setIsPending ? "Setting..." : "Set"}</Button>
			</div>
			<h2 className="mt-6 mb-4 text-4xl">Events</h2>
			<div className="flex flex-col w-full">
				{events.length > 0 && [...events].reverse().map((event) => {
					return (
						<Event event={event} key={crypto.randomUUID()}/>
					)
				})}
			</div>
		</div>
	)
}

export default SimpleStorage