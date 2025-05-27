const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const {assert, expect} = require("chai")
const {ethers} = require("hardhat")
const helpers = require("@nomicfoundation/hardhat-network-helpers");

describe("SimpleStorage2 Tests", () => {
    // Fixture: set the testing environement up
    async function deployContract() {
        const [owner, otherAccount] = await ethers.getSigners();
        const SimpleStorage2 = await ethers.getContractFactory("SimpleStorage2");
        const simpleStorage2 = await SimpleStorage2.deploy(SimpleStorage2);
        return {simpleStorage2, owner, otherAccount};
    }

    describe("Deployment function", () => {
        it("Should deploy SimpleStorage2 smart contract", async () => {
            // Call the fixture
            const {simpleStorage2} = await loadFixture(deployContract);
            //expect(await simpleStorage2.getValue()).to.equal(0);
            let value = await simpleStorage2.getValue();
            assert(value === 0n);
        })
    })

    describe("Set function", () => {
        it("Should set new value inside the smart contract", async () => {
            const {simpleStorage2, owner, otherAccount} = await loadFixture(deployContract);
            const newValue = 42n;

            await simpleStorage2.connect(otherAccount).setValue(newValue);
            const storedValue = await simpleStorage2.getValue();
            assert(storedValue === newValue);
        })
    })

    describe("getCurrentTimestamp", () => {
        it("Should get the time", async () => {
            const {simpleStorage2} = await loadFixture(deployContract);
            const futureTimestamp = 2000000000;
            await helpers.time.increaseTo(futureTimestamp);
            let currentTimestamp = await simpleStorage2.getCurrentTime();
            assert(Number(currentTimestamp) === futureTimestamp);

            // Mine 1000 blocks with an interval of 15 seconds between each
            await helpers.mine(1000, {interval: 15});
            let timestamOfLastBlock = await helpers.time.latest();
            console.log(Number(timestamOfLastBlock));
        })
    })
})