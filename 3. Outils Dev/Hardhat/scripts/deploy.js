const hre = require("hardhat");

async function main() {
    const number = 42;
    const SimpleStorage = await hre.ethers.deployContract("SimpleStorage", [number]);
    await SimpleStorage.waitForDeployment();
    console.log("SimpleStorage deployed to: ", SimpleStorage.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});