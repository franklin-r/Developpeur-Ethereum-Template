"use client";
import { useBlockNumber, useReadContract } from "wagmi";
import { mainnet } from "wagmi/chains";
import {abi} from "./abi";

export default function Home() {

	const {data: blockNumber} = useBlockNumber({
		chainId: mainnet.id,
		watch: true
	});

	const {data: balance} = useReadContract({
		address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
		abi: abi,
		functionName: "balanceOf",
		args: ["0x6B175474E89094C44Da98b954EedeAC495271d0F"],
		chainId: 1
	})

	return (
		<>
			<p>BlockNumber on the mainnet: {blockNumber && blockNumber.toString()}</p>
			<p>DAI balance of 0x6B175474E89094C44Da98b954EedeAC495271d0F: {balance && balance.toString()} DAI</p>
		</>
	);
}
