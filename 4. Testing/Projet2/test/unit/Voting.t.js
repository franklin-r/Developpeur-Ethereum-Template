const {expect} = require("chai");
const {ethers} = require("hardhat");
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Voting Tests", () => {

    // =============================== FIXTURES =============================== //

    async function deployContractFixture() {
        const [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
        const Voting = await ethers.getContractFactory("Voting");
        const voting = await Voting.deploy();
        return {voting, owner, addr1, addr2, addr3, addr4, addr5};
    }

    async function addVoterFixture() {
        const {voting, owner, addr1, addr2, addr3, addr4, addr5} = await loadFixture(deployContractFixture);
        await voting.addVoter(addr1);
        await voting.addVoter(addr2);
        await voting.addVoter(addr3);
        await voting.addVoter(addr4);
        // addr5 is not registred
        return {voting, owner, addr1, addr2, addr3, addr4, addr5};
    }

    async function addProposalFixture() {
        const {voting, owner, addr1, addr2, addr3, addr4, addr5} = await loadFixture(addVoterFixture);
        await voting.startProposalsRegistering();
        await voting.connect(addr1).addProposal("Bitcoin");
        await voting.connect(addr2).addProposal("Ethereum");
        await voting.connect(addr3).addProposal("Solana");
        // addr4 doesn't make any proposal
        const nProposals = 4;   // When changing phase, a 'GENESIS' proposal is created.
        return {voting, owner, addr1, addr2, addr3, addr4, addr5, nProposals};
    }

    async function betweenProposalsRegistrationAndVotingFixture() {
        const {voting, owner, addr1, addr2, addr3, addr4, addr5, nProposals} = await loadFixture(addProposalFixture);
        await voting.endProposalsRegistering();
        return {voting, owner, addr1, addr2, addr3, addr4, addr5, nProposals};
    }

    async function setVoteFixture() {
        const {voting, owner, addr1, addr2, addr3, addr4, addr5, nProposals} = await loadFixture(betweenProposalsRegistrationAndVotingFixture);
        await voting.startVotingSession();
        await voting.connect(addr1).setVote(2);
        await voting.connect(addr2).setVote(1);
        await voting.connect(addr3).setVote(1);
        const winningProposalId = 1n;
        // addr4 doesn't vote
        return {voting, owner, addr1, addr2, addr3, addr4, addr5, nProposals, winningProposalId};
    }

    async function betweenVotingSessionAndVotesTalliedFixture() {
        const {voting, owner, addr1, addr2, addr3, addr4, addr5, nProposals, winningProposalId} = await loadFixture(setVoteFixture);
        await voting.endVotingSession();
        return {voting, owner, addr1, addr2, addr3, addr4, addr5, nProposals, winningProposalId};
    }
    
    async function votesTalliedFixture() {
        const {voting, owner, addr1, addr2, addr3, addr4, addr5, nProposals, winningProposalId} = await loadFixture(betweenVotingSessionAndVotesTalliedFixture);
        await voting.tallyVotes();
        return {voting, owner, addr1, addr2, addr3, addr4, addr5, nProposals, winningProposalId};
    }

    // ============================== DEPLOYMENT ============================== //

    describe("constructor", () => {
        it("Deployer should be owner", async () => {
            const {voting, owner} = await loadFixture(deployContractFixture);
            expect(await voting.owner()).to.equal(owner.address);
        })
    })

    // ========================== VOTERS REGISTRATION ========================== //

    describe("Voters Registration Stage", () => {

        let voting, addr1, addr5;
        beforeEach(async () => {
            const fixture = await loadFixture(addVoterFixture);
            voting = fixture.voting;
            addr1 = fixture.addr1;
            addr5 = fixture.addr5;
        })

        it("Should revert if other account registers an address", async () => {
            await expect(voting.connect(addr1).addVoter(addr5)).to.be
            .revertedWithCustomError(
                voting,
                "OwnableUnauthorizedAccount"
            )
            .withArgs(addr1.address);
        })

        it("Should not revert if owner registers an account", async () => {
            await expect(voting.addVoter(addr5)).to.not.be.reverted;
        })

        it("Should not register the same address twice", async () => {
            await expect(voting.addVoter(addr1)).to.be
            .revertedWith("Already registered");
        })

        it("Should register a voter", async () => {
            await voting.addVoter(addr5);
            const voter = await voting.connect(addr1).getVoter(addr5);
            expect(voter[0]).to.equal(true);    // isRegistered
            expect(voter[1]).to.equal(false);   // hasVoted
            expect(voter[2]).to.equal(0n);      // votedProposalId
        })

        it("Should emit event after voter registration", async () => {
            await expect(voting.addVoter(addr5)).to
            .emit(
                voting,
                "VoterRegistered"
            )
            .withArgs(
                addr5
            );
        })

        it("Should revert if trying to make proposal", async () => {
            await expect(voting.connect(addr1).addProposal("Bitcoin")).to.be
            .revertedWith("Proposals are not allowed yet");
        })

        it("Should revert if trying to vote", async () => {
            await expect(voting.connect(addr1).setVote(0)).to.be
            .revertedWith("Voting session havent started yet");
        })

        it("Should revert if trying to tally votes", async () => {
            await expect(voting.tallyVotes()).to.be
            .revertedWith("Current status is not voting session ended");
        })
    })

    // ======================== PROPOSALS REGISTRATION ======================== //

    describe("Proposals Registration Stage", () => {
        
        let voting, addr1, addr4, addr5, nProposals;
        beforeEach(async () => {
            const fixture = await loadFixture(addProposalFixture);
            voting = fixture.voting;
            addr1 = fixture.addr1;
            addr4 = fixture.addr4;
            addr5 = fixture.addr5;
            nProposals = fixture.nProposals;
        })

        it("Should revert if unregistered account makes a proposal", async () => {
            await expect(voting.connect(addr5).addProposal("Kaspa")).to.be
            .revertedWith("You're not a voter");
        })

        it("Should not revert if registered account makes a proposal", async () => {
            await expect(voting.connect(addr4).addProposal("Kaspa")).to.not.be.reverted;
        })

        it("Should revert if empty proposal", async () => {
            await expect(voting.connect(addr1).addProposal("")).to.be
            .revertedWith("Vous ne pouvez pas ne rien proposer");
        })

        it("Should register proposal", async () => {
            await voting.connect(addr4).addProposal("Kaspa");
            nProposals += 1;
            const proposal = await voting.connect(addr1).getOneProposal(nProposals - 1);
            expect(proposal[0]).to.equal("Kaspa");  // description
            expect(proposal[1]).to.equal(0n);       // voteCount
        })

        it("Should not revert if same address makes two proposals", async () => {
            await expect(voting.connect(addr1).addProposal("Kaspa")).to.not.be.reverted;
        })

        it("Should not revert if same proposal twice", async () => {
            await expect(voting.connect(addr1).addProposal("Bitcoin")).to.not.be.reverted;
        })

        it("Should emit event after proposal registration", async () => {
            nProposals += 1;
            await expect(voting.connect(addr4).addProposal("Kaspa")).to
            .emit(
                voting,
                "ProposalRegistered"
            )
            .withArgs(
                nProposals - 1
            )
        })

        it("Should revert if trying to register voter", async () => {
            await expect(voting.addVoter(addr5)).to.be
            .revertedWith("Voters registration is not open yet");
        })

        it("Should revert if trying to vote", async () => {
            await expect(voting.connect(addr1).setVote(0)).to.be
            .revertedWith("Voting session havent started yet");
        })

        it("Should revert if trying to tally votes", async () => {
            await expect(voting.tallyVotes()).to.be
            .revertedWith("Current status is not voting session ended");
        })
    })

    // ================================ VOTING ================================ //

    describe("Voting Stage", () => {
        
        let voting, addr1, addr4, addr5, nProposals;
        beforeEach(async () => {
            const fixture = await loadFixture(setVoteFixture);
            voting = fixture.voting;
            addr1 = fixture.addr1;
            addr4 = fixture.addr4;
            addr5 = fixture.addr5;
            nProposals = fixture.nProposals;
        })

        it("Should revert if unregistered account votes", async () => {
            await expect(voting.connect(addr5).setVote(1)).to.be
            .revertedWith("You're not a voter");
        })

        it("Should not revert if registered account votes", async () => {
            await expect(voting.connect(addr4).setVote(1)).to.not.be.reverted;
        })

        it("Should revert if trying to vote twice", async () => {
            await expect(voting.connect(addr1).setVote(1)).to.be
            .revertedWith("You have already voted");
        })

        it("Should revert if voting for unexisting proposal", async () => {
            await expect(voting.connect(addr4).setVote(nProposals)).to.be
            .revertedWith("Proposal not found");
        })

        it("Should not revert if voting for existing proposal", async () => {
            await expect(voting.connect(addr4).setVote(nProposals - 1)).to.not.be.reverted;
        })

        it("Should update voter's data after vote", async () => {
            const proposalId = 1n;
            await voting.connect(addr4).setVote(proposalId);
            const voter = await voting.connect(addr1).getVoter(addr4);
            expect(voter[0]).to.equal(true);        // isRegistered
            expect(voter[1]).to.equal(true);        // hasVoted
            expect(voter[2]).to.equal(proposalId);  // votedProposalId
        })

        it("Should update proposal's vote count after vote", async () => {
            const proposalId = 1n;
            const [, voteCountBeforeVote] = await voting.connect(addr1).getOneProposal(proposalId);
            await voting.connect(addr4).setVote(proposalId);
            const [, voteCountAfterVote] = await voting.connect(addr1).getOneProposal(proposalId);
            expect(voteCountAfterVote).to.equal(voteCountBeforeVote + 1n);
        })

        it("Should emit event after vote", async () => {
            const proposalId = 1n;
            await expect(voting.connect(addr4).setVote(proposalId)).to
            .emit(
                voting,
                "Voted"
            )
            .withArgs(
                addr4.address,
                proposalId
            )
        })

        it("Should revert if trying to register voter", async () => {
            await expect(voting.addVoter(addr5)).to.be
            .revertedWith("Voters registration is not open yet");
        })

        it("Should revert if trying to make proposal", async () => {
            await expect(voting.connect(addr1).addProposal("Bitcoin")).to.be
            .revertedWith("Proposals are not allowed yet");
        })

        it("Should revert if trying to tally votes", async () => {
            await expect(voting.tallyVotes()).to.be
            .revertedWith("Current status is not voting session ended");
        })
    })

    // ================================ TALLY ================================ //

    describe("Tally Stage", () => {
        
        let voting, addr1, winningProposalId;
        beforeEach(async () => {
            const fixture = await loadFixture(betweenVotingSessionAndVotesTalliedFixture);
            voting = fixture.voting;
            addr1 = fixture.addr1;
            winningProposalId = fixture.winningProposalId;
        })

        it("Should revert if other account tallies votes", async () => {
            await expect(voting.connect(addr1).tallyVotes()).to.be
            .revertedWithCustomError(
                voting,
                "OwnableUnauthorizedAccount"
            )
            .withArgs(addr1.address);
        })

        it("Should not revert if owner tallies votes", async () => {
            await expect(voting.tallyVotes()).to.not.be.reverted;
        })

        it("Should find correct winning proposal id", async () => {
            await voting.tallyVotes();
            expect(await voting.winningProposalID()).to.equal(winningProposalId);
        })
    })

    // ======================== WORKFLOW STATUS CHANGE ======================== //

    describe("Workflow Status Change", () => {
        describe("From Voters Registration To Proposals Registration", () => {

            let voting, addr1;
            beforeEach(async () => {
                const fixture = await loadFixture(addVoterFixture);
                voting = fixture.voting;
                addr1 = fixture.addr1;
            })

            it("Should revert if other account start proposal registration", async () => {
                await expect(voting.connect(addr1).startProposalsRegistering()).to.be
                .revertedWithCustomError(
                    voting,
                    "OwnableUnauthorizedAccount"
                )
                .withArgs(addr1.address);
            })

            it("Should not revert if owner start proposal registration", async () => {
                await expect(voting.startProposalsRegistering()).to.not.be.reverted;
            })

            it("Should become ProposalsRegistrationStarted", async () => {
                const proposalRegistrationStartedIndex = 1;
                await voting.startProposalsRegistering();
                expect(await voting.workflowStatus()).to.equal(proposalRegistrationStartedIndex);
            })

            it("Should create 'GENESIS' proposal", async () => {
                await voting.startProposalsRegistering();
                const genesisProposal = await voting.connect(addr1).getOneProposal(0);
                expect(genesisProposal[0]).to.equal("GENESIS");
                expect(genesisProposal[1]).to.equal(0);
            })

            it("Should emit event after start of proposal registration", async () => {
                const registeringVotersIndex = 0;
                const proposalRegistrationStartedIndex = 1;
                await expect(voting.startProposalsRegistering()).to
                .emit(
                    voting,
                    "WorkflowStatusChange"
                )
                .withArgs(
                    registeringVotersIndex,
                    proposalRegistrationStartedIndex
                );
            })

            it("Should revert if ending proposal registration", async () => {
                await expect(voting.endProposalsRegistering()).to.be
                .revertedWith("Registering proposals havent started yet");
            })

            it("Should revert if starting voting session", async () => {
                await expect(voting.startVotingSession()).to.be
                .revertedWith("Registering proposals phase is not finished");
            })

            it("Should revert if ending voting session", async () => {
                await expect(voting.endVotingSession()).to.be
                .revertedWith("Voting session havent started yet");
            })
        })
        
        describe("From Proposal Registration to After Proposal Registration", () => {

            let voting, addr1;
            beforeEach(async () => {
                const fixture = await loadFixture(addProposalFixture);
                voting = fixture.voting;
                addr1 = fixture.addr1;
            })

            it("Should revert if other account end proposal registration", async () => {
                await expect(voting.connect(addr1).endProposalsRegistering()).to.be
                .revertedWithCustomError(
                    voting,
                    "OwnableUnauthorizedAccount"
                )
                .withArgs(addr1.address);
            })

            it("Should not revert if owner end proposal registration", async () => {
                await expect(voting.endProposalsRegistering()).to.not.be.reverted;
            })

            it("Should become ProposalsRegistrationEnded", async () => {
                const proposalRegistrationEndedIndex = 2;
                await voting.endProposalsRegistering();
                expect(await voting.workflowStatus()).to.equal(proposalRegistrationEndedIndex);
            })

            it("Should emit event after end of proposal registration", async () => {
                const proposalRegistrationStartedIndex = 1;
                const proposalRegistrationEndedIndex = 2;
                await expect(voting.endProposalsRegistering()).to
                .emit(
                    voting,
                    "WorkflowStatusChange"
                )
                .withArgs(
                    proposalRegistrationStartedIndex,
                    proposalRegistrationEndedIndex
                );
            })

            it("Should revert if starting proposal registration", async () => {
                await expect(voting.startProposalsRegistering()).to.be
                .revertedWith("Registering proposals cant be started now");
            })

            it("Should revert if starting voting session", async () => {
                await expect(voting.startVotingSession()).to.be
                .revertedWith("Registering proposals phase is not finished");
            })

            it("Should revert if ending voting session", async () => {
                await expect(voting.endVotingSession()).to.be
                .revertedWith("Voting session havent started yet");
            })
        })

        describe("From After Proposal Registration to Voting Session", () => {

            let voting, addr1;
            beforeEach(async () => {
                const fixture = await loadFixture(betweenProposalsRegistrationAndVotingFixture);
                voting = fixture.voting;
                addr1 = fixture.addr1;
            })

            it("Should revert if other account start voting session", async () => {
                await expect(voting.connect(addr1).startVotingSession()).to.be
                .revertedWithCustomError(
                    voting,
                    "OwnableUnauthorizedAccount"
                )
                .withArgs(addr1.address);
            })

            it("Should not revert if owner start voting session", async () => {
                await expect(voting.startVotingSession()).to.not.be.reverted;
            })

            it("Should become VotingSessionStarted", async () => {
                const votingSessionStartedIndex = 3;
                await voting.startVotingSession();
                expect(await voting.workflowStatus()).to.equal(votingSessionStartedIndex);
            })

            it("Should emit event after start of voting session", async () => {
                const proposalRegistrationEndedIndex = 2;
                const votingSessionStartedIndex = 3;
                await expect(voting.startVotingSession()).to
                .emit(
                    voting,
                    "WorkflowStatusChange"
                )
                .withArgs(
                    proposalRegistrationEndedIndex,
                    votingSessionStartedIndex
                );
            })

            it("Should revert if starting proposal registration", async () => {
                await expect(voting.startProposalsRegistering()).to.be
                .revertedWith("Registering proposals cant be started now");
            })

            it("Should revert if ending proposal registration", async () => {
                await expect(voting.endProposalsRegistering()).to.be
                .revertedWith("Registering proposals havent started yet");
            })

            it("Should revert if ending voting session", async () => {
                await expect(voting.endVotingSession()).to.be
                .revertedWith("Voting session havent started yet");
            })
        })

        describe("From Voting Session to After Voting Session", () => {

            let voting, addr1;
            beforeEach(async () => {
                const fixture = await loadFixture(setVoteFixture);
                voting = fixture.voting;
                addr1 = fixture.addr1;
            })

            it("Should revert if other account end voting session", async () => {
                await expect(voting.connect(addr1).endVotingSession()).to.be
                .revertedWithCustomError(
                    voting,
                    "OwnableUnauthorizedAccount"
                )
                .withArgs(addr1.address);
            })

            it("Should not revert if owner end voting session", async () => {
                await expect(voting.endVotingSession()).to.not.be.reverted;
            })

            it("Should become VotingSessionEnded", async () => {
                const votingSessionEndedIndex = 4;
                await voting.endVotingSession();
                expect(await voting.workflowStatus()).to.equal(votingSessionEndedIndex);
            })

            it("Should emit event after end voting session", async () => {
                const votingSessionStartedIndex = 3;
                const votingSessionEndedIndex = 4;
                await expect(voting.endVotingSession()).to
                .emit(
                    voting,
                    "WorkflowStatusChange"
                )
                .withArgs(
                    votingSessionStartedIndex,
                    votingSessionEndedIndex
                );
            })

            it("Should revert if starting proposal registration", async () => {
                await expect(voting.startProposalsRegistering()).to.be
                .revertedWith("Registering proposals cant be started now");
            })

            it("Should revert if ending proposal registration", async () => {
                await expect(voting.endProposalsRegistering()).to.be
                .revertedWith("Registering proposals havent started yet");
            })

            it("Should revert if starting voting session", async () => {
                await expect(voting.startVotingSession()).to.be
                .revertedWith("Registering proposals phase is not finished");
            })
        })

        describe("From After Voting Session To Votes Tallied", () => {

            let voting;
            beforeEach(async () => {
                const fixture = await loadFixture(betweenVotingSessionAndVotesTalliedFixture);
                voting = fixture.voting;
            })

            it("Should become VotesTallied", async () => {
                const votesTalliedIndex = 5;
                await voting.tallyVotes();
                expect(await voting.workflowStatus()).to.equal(votesTalliedIndex);
            })

            it("Should emit event after votes tallied", async () => {
                const votingSessionEndedIndex = 4;
                const votesTalliedIndex = 5;
                await expect(voting.tallyVotes()).to
                .emit(
                    voting,
                    "WorkflowStatusChange"
                )
                .withArgs(
                    votingSessionEndedIndex,
                    votesTalliedIndex
                );
            })

            it("Should revert if starting proposal registration", async () => {
                await expect(voting.startProposalsRegistering()).to.be
                .revertedWith("Registering proposals cant be started now");
            })

            it("Should revert if ending proposal registration", async () => {
                await expect(voting.endProposalsRegistering()).to.be
                .revertedWith("Registering proposals havent started yet");
            })

            it("Should revert if starting voting session", async () => {
                await expect(voting.startVotingSession()).to.be
                .revertedWith("Registering proposals phase is not finished");
            })

            it("Should revert if ending voting session", async () => {
                await expect(voting.endVotingSession()).to.be
                .revertedWith("Voting session havent started yet");
            })
        })
    })

    // ================================ GETTERS ================================ //

    describe("Getters", () => {

        let voting, addr1, addr4, addr5, nProposals;
        beforeEach(async () => {
            const fixture = await loadFixture(votesTalliedFixture);
            voting = fixture.voting;
            addr1 = fixture.addr1;
            addr4 = fixture.addr4;
            addr5 = fixture.addr5;
            nProposals = fixture.nProposals;
        })

        describe("getVoter", () => {

            it("Should revert if unregistered account gets voter", async () => {
                await expect(voting.connect(addr5).getVoter(addr1)).to.be
                .revertedWith("You're not a voter");
            })

            it("Should not revert if registered account gets voter", async () => {
                await expect(voting.connect(addr4).getVoter(addr1)).to.not.be.reverted;
            })

            it("Should return correct voter's data", async () => {
                const voter = await voting.connect(addr4).getVoter(addr1);
                expect(voter[0]).to.equal(true);
                expect(voter[1]).to.equal(true);
                expect(voter[2]).to.equal(2n);
            })
        })

        describe("getOneProposal", () => {

            it("Should revert if unregistered account gets proposal", async () => {
                await expect(voting.connect(addr5).getOneProposal(1)).to.be
                .revertedWith("You're not a voter");
            })

            it("Should not revert if registered account gets proposal", async () => {
                await expect(voting.connect(addr4).getOneProposal(1)).to.not.be.reverted;
            })

            it("Should return correct proposal's data", async () => {
                const proposal = await voting.connect(addr4).getOneProposal(1);
                expect(proposal[0]).to.equal("Bitcoin");
                expect(proposal[1]).to.equal(2);
            })

            it("Should revert if proposal does not exist", async () => {
                await expect(voting.connect(addr1).getOneProposal(nProposals)).to.be.reverted;
            })
        })
    })
})