import { ethers } from "hardhat";

async function main() {
    const number = 42;
    const SimpleStorage = await ethers.deployContract("SimpleStorage", [number]);
    await SimpleStorage.waitForDeployment();
    console.log("SimpleStorage deployed to: ", SimpleStorage.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});