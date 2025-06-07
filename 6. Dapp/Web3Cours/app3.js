import Web3 from 'web3';

const rpcUrl = "https://sepolia.infura.io/v3/86ead153b76f4eb0a8be881b71541006";
const web3 = new Web3(rpcUrl);

const address = "0x0c2fEdEa700391069369F39754b0bE8B676a7f0E";

const abi = [
	{
		"inputs": [],
		"name": "get",
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
];

const simpleStorage = new web3.eth.Contract(abi, address);

try {
    const value = await simpleStorage.methods.get().call();
    console.log(`value : ${value}`);
}
catch (err) {
    console.error("Error while calling retrieve():", err);
}
