import Web3 from 'web3';

const rpcUrl = "https://sepolia.infura.io/v3/86ead153b76f4eb0a8be881b71541006";
const web3 = new Web3(rpcUrl);

const address = "0xf645c4A7240b9Adf7148e73f6b0c6e2DCE37A3e2";

const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "store",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "retrieve",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const simpleStorage = new web3.eth.Contract(abi, address);

try {
    const value = await simpleStorage.methods.retrieve().call();
    console.log(`value : ${value}`);
}
catch (err) {
    console.error("Error while calling retrieve():", err);
}
