const {assert, expect} = require("chai");
const {ethers} = require("hardhat");

describe("SimpleStorage Tests", () => {
    
    let owner, addr1, addr2, addr3;
    let simpleStorage;

    beforeEach(async () => {
        // Get a whole set of information about en Ethereum account
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        
        // Retrieve SC
        simpleStorage = await ethers.getContractFactory("SimpleStorage");
        
        simpleStorage = await simpleStorage.deploy();
    })

    // Tests category
    describe("Set and get number", () => {
        // Creates a test
        it("Should get the number and number should be equal to 0", async () => {
            // By default, runs the function with the first account, i.e. owner
            let number = await simpleStorage.getNumber();
            assert(number === 0n);
        })

        it("Should not set the number to 99", async () => {
            // Runs the function with account 'addr1'
            await expect(simpleStorage.connect(addr1).setNumber(99)).to.be.revertedWithCustomError(
                simpleStorage,
                "NumberOutOfRange"
            );

        })

        it("Should set the number to 7", async () => {
            await simpleStorage.connect(addr2).setNumber(7);
            let number = await simpleStorage.connect(addr2).getNumber();
            assert(number === 7n);
        })

        it("Should set number with different accounts", async () => {
            await simpleStorage.setNumber(9);
            let number_owner = await simpleStorage.getNumber();
            assert(number_owner === 9n);

            await simpleStorage.connect(addr3).setNumber(3);
            let number_addr3 = await simpleStorage.connect(addr3).getNumber();
            assert(number_addr3 === 3n);
        })

        it ("Should emit an event if number is changed", async () => {
            await expect(simpleStorage.setNumber(5))
            .to.emit(simpleStorage, "NumberChanged")
            .withArgs(owner.address, 5);
            
        })
    })
})