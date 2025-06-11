"use client";
import { useState, useEffect } from "react";
import { createPublicClient, http, parseAbiItem, formatEther } from "viem";
import {mainnet} from "viem/chains";

const client = createPublicClient({
  	chain: mainnet,
	transport: http("https://mainnet.infura.io/v3/86ead153b76f4eb0a8be881b71541006")
})

export default function Home() {
	const [blockNumber, setBlockNumber] = useState(0);
	const [depositEvents, setDepositEvents] = useState([]);

	useEffect(() => {
		const getInfos = async () => {
			const blockNumber = await client.getBlockNumber();
			return blockNumber.toString();
		}
		const blockNumber = getInfos();
		setBlockNumber(blockNumber);
	}, []);

	useEffect(() => {
		const getLogs = async () => {
			const logs = await client.getLogs({  
				address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
				event: parseAbiItem('event Deposit(address indexed, uint)'),
				fromBlock: 19520060n,
				toBlock: 19520070n
			})
			setDepositEvents(logs);
		}
		getLogs();
	}, []);

	return (
		<>
			<p>{blockNumber}</p>
			<div>
				{depositEvents.length > 0 && depositEvents.map((depositEvent) => {
					return (
						<p key={crypto.randomUUID()}>
							Address: {depositEvent.args[0]} - Amount: {formatEther(depositEvent.args[1])} ETH
						</p>
					)
				})}
			</div>
		</>
		
	);
}
