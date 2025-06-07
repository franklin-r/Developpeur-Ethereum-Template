import Web3 from 'web3';

const rpcUrl = "https://sepolia.infura.io/v3/86ead153b76f4eb0a8be881b71541006";
const web3 = new Web3(rpcUrl);

const address = "0x5941fd401ec7580c77ac31E45c9f59436a2f8C1b";

try {
    const balanceWei = await web3.eth.getBalance(address);
    const balanceEth = web3.utils.fromWei(balanceWei, "ether");
    console.log(`Balance: ${balanceEth} ETH`);
} catch (err) {
    console.error("Erreur lors de la récupération du solde :", err);
}
