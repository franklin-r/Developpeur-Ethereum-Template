import { createPublicClient, http } from "viem";
import {hardhat, sepolia} from "viem/chains";

const SEPOLIA_PUBLIC_RPC_URL = process.env.SEPOLIA_PUBLIC_RPC_URL || "";

export const publicClient = createPublicClient({
	//chain: hardhat,
	chain: sepolia,
	transport: http(SEPOLIA_PUBLIC_RPC_URL)
})