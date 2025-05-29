const {expect} = require("chai");
const {ethers} = require("hardhat");
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Bank Tests", () => {
    async function deployContract() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Bank = await ethers.getContractFactory("Bank");
        const bank = await Bank.deploy();
        return {bank, owner, otherAccount};
    }

    async function depositToContract() {
        const {bank, owner, otherAccount} = await loadFixture(deployContract);
        const depositValue = ethers.parseEther("5");
        await bank.deposit({value: depositValue});
        return {bank, depositValue, owner, otherAccount}
    }

    let bank, owner, otherAccount;
    beforeEach(async () => {
        const fixture = await loadFixture(deployContract);
        bank = fixture.bank;
        owner = fixture.owner;
        otherAccount = fixture.otherAccount;
    })

    describe("Constructor", () => {
        it("Deployer should be owner", async () => {
            expect(await bank.owner()).to.equal(owner.address);
        })

        it("Smart contract should be empty", async () => {
            expect(await ethers.provider.getBalance(bank.target)).to.equal(0);
        })
    })

    describe("Deposit", () => {
        // Do not need to test balances updates because it is intrinsic to Ethereum, not to the contract.

        it("Should be accessed by owner only", async () => {
            const depositValue = ethers.parseEther("0.5");
            await expect(bank.connect(otherAccount).deposit({value: depositValue})).to.be
            .revertedWithCustomError(
                bank,
                "OwnableUnauthorizedAccount"
            )
            .withArgs(otherAccount.address);
        })

        it("Should deposit more than 0.1 ETH", async () => {
            const depositValue = ethers.parseEther("0.1");
            await expect(bank.deposit({value: depositValue})).to.be
            .revertedWith("Not enough funds provided");
        })

        it("Should emit Deposit event", async () => {
            const depositValue = ethers.parseEther("0.5");
            await expect(bank.deposit({value: depositValue})).to
            .emit(
                bank,
                "Deposit"
            )
            .withArgs(
                owner.address,
                depositValue
            )
        })
    })

    describe("Withdraw", () => {
        beforeEach(async () => {
            const depositValue = ethers.parseEther("5");
            await bank.deposit({value: depositValue});
        })

        it("Should be accessed by owner only", async () => {
            const withdrawalValue = ethers.parseEther("0.7");
            await expect(bank.connect(otherAccount).withdraw(withdrawalValue)).to.be
            .revertedWithCustomError(
                bank,
                "OwnableUnauthorizedAccount"
            )
            .withArgs(otherAccount.address);
        })

        it("Should have enough deposit", async () => {
            const withdrawalValue = ethers.parseEther("10");
            await expect(bank.withdraw(withdrawalValue)).to.be
            .revertedWith("You cannot withdraw this amount");
        })

        it("Should emit Withdraw event", async () => {
            const withdrawalValue = ethers.parseEther("1");
            await expect(bank.withdraw(withdrawalValue)).to
            .emit(
                bank,
                "Withdraw"
            )
            .withArgs(
                owner.address,
                withdrawalValue
            )
        })
    })
})