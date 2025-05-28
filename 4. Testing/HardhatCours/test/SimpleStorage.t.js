const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const {assert, expect} = require("chai")
const {ethers} = require("hardhat")
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { BN } = require("ethereumjs-util");

describe("SimpleStorage Tests", () => {
  // Fixture: set the testing environement up
  // Could use a hook (beforeEach()) where we load the fixture
  async function deployContract() {
    const initialNumber = 2;
    const [owner, otherAccount] = await ethers.getSigners();
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorage.deploy(initialNumber);
    return {simpleStorage, owner, otherAccount, initialNumber};
  }

  async function deployContract2() {
    const {simpleStorage, owner, otherAccount, initialNumber} = await loadFixture(deployContract);
    await simpleStorage.set(4);
    return {simpleStorage, owner, otherAccount, initialNumber};
  }

  describe("Deployment function", () => {
    it("Should deploy SimpleStorage smart contract", async () => {
      // Call the fixture
      const {simpleStorage, owner, otherAccount, initialNumber} = await loadFixture(deployContract);
      expect(await simpleStorage.getNumber()).to.equal(initialNumber);
    })
  })

  describe("Set function", () => {
    it("Should set new value inside the smart contract", async () => {
      const {simpleStorage, owner, otherAccount} = await loadFixture(deployContract);
      const newNumber = 7;

      await simpleStorage.connect(otherAccount).setNumber(newNumber);
      expect(await simpleStorage.getNumber()).to.equal(newNumber);
    })

    it("Should revert because number too big", async () => {
      const {simpleStorage} = await loadFixture(deployContract);
      const newNumber = 42;
      await expect(simpleStorage.setNumber(newNumber)).to.be
      .revertedWithCustomError(simpleStorage, "NumberTooBig")
      .withArgs(newNumber);
    })

    it("Should emit event", async () => {
      const {simpleStorage} = await loadFixture(deployContract);
      const newNumber = 9;
      await expect(simpleStorage.setNumber(newNumber)).to.be
      .emit(simpleStorage, "NumberChanged")
      .withArgs(newNumber);
    })
  })

  describe("Get function", () => {
    it("Should get the value", async () => {
      const {simpleStorage, owner, otherAccount, initialNumber} = await loadFixture(deployContract);
      const storage = await ethers.provider.getStorage(
        simpleStorage.target, // address
        0 // #slot
      );
      expect(storage).to.be.equal(new BN(initialNumber));
    })
  })

  describe("Increment function", () => {
    it("Should increment the value", async () => {
      const {simpleStorage, owner, otherAccount, initialNumber} = await loadFixture(deployContract);
      await simpleStorage.increment();
      const numberAfterIncrement = await simpleStorage.getNumber();
      expect(numberAfterIncrement).to.be.equal(initialNumber + 1);
    })

    it("Should emit event", async () => {
      const {simpleStorage} = await loadFixture(deployContract);
      await expect(simpleStorage.increment()).to.be
      .emit(simpleStorage, "NumberChanged");
    })
  })
})