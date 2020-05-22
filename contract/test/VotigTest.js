
const BN = require('bn.js');

const TestToken = artifacts.require("TestToken");
const Voting = artifacts.require("Voting");

contract("Voting test", async accounts => {
    let token;
    let voting;
    let threshold;
    let majority;
    let optionCount = 2;

    async function resetToken() {
        token = await TestToken.new();

        await token.transfer(accounts[1], web3.utils.toWei('10000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[2], web3.utils.toWei('15000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[3], web3.utils.toWei('20000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[4], web3.utils.toWei('25000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[5], web3.utils.toWei('30000000', 'ether'), { from: accounts[0] });
    }

    before(async () => {
        await resetToken();

        let totalSupply = await token.totalSupply();
        threshold = totalSupply.div(new BN('20', 10));
        majority = 800;
    });


    // ****************************
    // *** With only 2 options  ***
    // ****************************

    it("2 OPTIONS: should not able to vote or get status before voting starts", async () => {
        let now = Math.floor(Date.now() / 1000);
        voting = await Voting.new(token.address, now - 100, now + 300, optionCount, threshold, majority);

        await voting.setStartTime(now + 10);
        // Should not be able to vote
        try {
            await voting.vote(1, { from: accounts[1] });
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }

        // Should throw a error when try to get vote status
        try {
            await voting.getTotalVote();
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }

    });

    it("2 OPTIONS: should be all 0 for the initial voting status", async () => {
        let now = Math.floor(Date.now() / 1000);
        voting = await Voting.new(token.address, now - 100, now + 300, optionCount, threshold, majority);
        let s = await voting.getTotalVote();
        assert.equal(s[0].toString(10), '0');
        assert.equal(s[1].toString(10), '0');
    });

    it("2 OPTIONS: should not allow voting for invalid options", async () => {
        try {
            await voting.vote(0, { from: accounts[1] });
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }

        try {
            await voting.vote(3, { from: accounts[1] });
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }
    });

    it("2 OPTIONS: should not allow voting for accounts with no token", async () => {
        try {
            await voting.vote(1, { from: accounts[6] });
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }
    });

    it("2 OPTIONS: should be the balance of account after account 1 vote", async () => {
        await voting.vote(1, { from: accounts[1] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), '0');
    });

    it("2 OPTIONS: Get the vote option", async () => {
        await voting.vote(1, { from: accounts[1] });

        let record = await voting.getVoteRecord(accounts[1]);
        assert.equal(record.toNumber(), 1);

        // 0 as the default value if the account has not voted
        record = await voting.getVoteRecord(accounts[0]);
        assert.equal(record.toNumber(), 0);
    });

    it("2 OPTIONS: should be the balance of accounts after account 2 vote", async () => {
        await voting.vote(2, { from: accounts[2] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));
    });

    it("2 OPTIONS: should be the balance of accounts after account 3 vote", async () => {
        await voting.vote(1, { from: accounts[3] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('30000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));
    });

    it("2 OPTIONS: transfer some test token and check the vote result again", async () => {
        await token.transfer(accounts[1], web3.utils.toWei('5000000', 'ether'), { from: accounts[2] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('35000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
    });

    it("2 OPTIONS: account 2 change its vote", async () => {
        await voting.vote(1, { from: accounts[2] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('45000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('0', 'ether').toString(10));

        // Has not reach the theshold yet
        isValid = await voting.isValid();
        assert.equal(isValid.valueOf(), false);
    });

    it("2 OPTIONS: the total votes has not reach the threshold yet", async () => {
        let isAlive = await voting.isAlive();
        assert.equal(isAlive.valueOf(), true);

        let isValid = await voting.isValid();
        assert.equal(isValid.valueOf(), false);
    });

    it("2 OPTIONS: account 4 votes, the voting should be finalized", async () => {
        await voting.vote(1, { from: accounts[4] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('70000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('0', 'ether').toString(10));

        let isAlive = await voting.isAlive();
        isValid = await voting.isValid();
        assert.equal(isAlive.valueOf(), false);
        assert.equal(isValid.valueOf(), true);

        // should not be able to vote
        try {
            await voting.vote(1, { from: accounts[1] });
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }
    });

    it("2 OPTIONS: check with another proportion with valid result", async () => {
        let token = await TestToken.new();

        // Transfer some token to accounts
        await token.transfer(accounts[1], web3.utils.toWei('10000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[2], web3.utils.toWei('15000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[3], web3.utils.toWei('30000000', 'ether'), { from: accounts[0] });

        let now = Math.floor(Date.now() / 1000);
        let voting = await Voting.new(token.address, now - 100, now + 300, optionCount, threshold, majority);

        await voting.vote(1, { from: accounts[1] });
        await voting.vote(2, { from: accounts[2] });
        await voting.vote(1, { from: accounts[3] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('40000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));

        let isAlive = await voting.isAlive();
        isValid = await voting.isValid();
        assert.equal(isAlive.valueOf(), true);
        assert.equal(isValid.valueOf(), true);
    });

    it("2 OPTIONS: check with third proportion with invalid results", async () => {
        let token = await TestToken.new();

        // Transfer some token to accounts
        await token.transfer(accounts[1], web3.utils.toWei('10000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[2], web3.utils.toWei('15000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[3], web3.utils.toWei('20000000', 'ether'), { from: accounts[0] });

        let now = Math.floor(Date.now() / 1000);
        let voting = await Voting.new(token.address, now - 100, now + 300, optionCount, threshold, majority);

        await voting.vote(1, { from: accounts[1] });
        await voting.vote(2, { from: accounts[2] });
        await voting.vote(1, { from: accounts[3] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('30000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));

        let isAlive = await voting.isAlive();
        isValid = await voting.isValid();
        assert.equal(isAlive.valueOf(), true);
        assert.equal(isValid.valueOf(), false);
    });

    it("2 OPTIONS: End the vote and make sure the results stays", async () => {
        let token = await TestToken.new();

        // Transfer some token to accounts
        await token.transfer(accounts[1], web3.utils.toWei('10000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[2], web3.utils.toWei('15000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[3], web3.utils.toWei('20000000', 'ether'), { from: accounts[0] });

        let now = Math.floor(Date.now() / 1000);
        let voting = await Voting.new(token.address, now - 100, now + 300, optionCount, threshold, majority);

        await voting.vote(1, { from: accounts[1] });
        await voting.vote(2, { from: accounts[2] });
        await voting.vote(1, { from: accounts[3] });

        // End it, should not be able to vote
        await voting.setEndTime(now - 1);
        try {
            await voting.vote(1, { from: accounts[1] });
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }

        // Some transfer after it ends, the result should stay as before
        await token.transfer(accounts[2], web3.utils.toWei('5000000', 'ether'), { from: accounts[1] });
        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('30000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));

        let isAlive = await voting.isAlive();
        isValid = await voting.isValid();
        assert.equal(isAlive.valueOf(), false);
        assert.equal(isValid.valueOf(), false);
    });


    // ****************************
    // ***    With 3 options    ***
    // ****************************
    it("3 OPTIONS: should not able to vote or get status before voting starts", async () => {
        await resetToken();
        optionCount = 3;

        let now = Math.floor(Date.now() / 1000);
        voting = await Voting.new(token.address, now - 100, now + 300, optionCount, threshold, majority);

        await voting.setStartTime(now + 10);
        // Should not be able to vote
        try {
            await voting.vote(1, { from: accounts[1] });
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }

        // Should throw a error when try to get vote status
        try {
            await voting.getTotalVote();
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }

        await voting.setStartTime(now - 10);
    });

    it("3 OPTIONS: should be all 0 for the initial voting status", async () => {
        let s = await voting.getTotalVote();
        assert.equal(s[0].toString(10), '0');
        assert.equal(s[1].toString(10), '0');
        assert.equal(s[2].toString(10), '0');
    });

    it("3 OPTIONS: should be the balance of account after account 1 vote", async () => {
        await voting.vote(1, { from: accounts[1] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), '0');
        assert.equal(s[2].toString(10), '0');
    });

    it("3 OPTIONS: should be the balance of accounts after account 2 vote", async () => {
        await voting.vote(2, { from: accounts[2] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), '0');
    });

    it("3 OPTIONS: should be the balance of accounts after account 3 vote", async () => {
        await voting.vote(3, { from: accounts[3] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('20000000', 'ether').toString(10));
    });

    it("3 OPTIONS: transfer some test token and check the vote result again", async () => {
        await token.transfer(accounts[1], web3.utils.toWei('5000000', 'ether'), { from: accounts[2] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('20000000', 'ether').toString(10));
    });

    it("3 OPTIONS: account 4 votes", async () => {
        await voting.vote(2, { from: accounts[4] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('35000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('20000000', 'ether').toString(10));
    });

    it("3 OPTIONS: account 1 transfer some token out", async () => {
        await token.transfer(accounts[0], web3.utils.toWei('5000000', 'ether'), { from: accounts[1] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('35000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('20000000', 'ether').toString(10));
    });

    it("3 OPTIONS: account 3 changes its vote and it should be finalized", async () => {
        await voting.vote(2, { from: accounts[3] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('55000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('0', 'ether').toString(10));

        let isAlive = await voting.isAlive();
        assert.equal(isAlive.valueOf(), false);

        let isValid = await voting.isValid();
        assert.equal(isValid.valueOf(), true);
    });

    it("3 OPTIONS: check with another proportion with valid result", async () => {
        let token = await TestToken.new();

        // Transfer some token to accounts
        await token.transfer(accounts[1], web3.utils.toWei('10000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[2], web3.utils.toWei('15000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[3], web3.utils.toWei('30000000', 'ether'), { from: accounts[0] });

        let now = Math.floor(Date.now() / 1000);
        let voting = await Voting.new(token.address, now - 100, now + 300, optionCount, threshold, majority);

        await voting.vote(1, { from: accounts[1] });
        await voting.vote(2, { from: accounts[2] });
        await voting.vote(3, { from: accounts[3] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('30000000', 'ether').toString(10));

        let isAlive = await voting.isAlive();
        isValid = await voting.isValid();
        assert.equal(isAlive.valueOf(), true);
        assert.equal(isValid.valueOf(), true);
    });

    it("3 OPTIONS: check with third proportion with invalid results", async () => {
        let token = await TestToken.new();

        // Transfer some token to accounts
        await token.transfer(accounts[1], web3.utils.toWei('10000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[2], web3.utils.toWei('15000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[3], web3.utils.toWei('20000000', 'ether'), { from: accounts[0] });

        let now = Math.floor(Date.now() / 1000);
        let voting = await Voting.new(token.address, now - 100, now + 300, optionCount, threshold, majority);

        await voting.vote(1, { from: accounts[1] });
        await voting.vote(2, { from: accounts[2] });
        await voting.vote(3, { from: accounts[3] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('20000000', 'ether').toString(10));

        let isAlive = await voting.isAlive();
        isValid = await voting.isValid();
        assert.equal(isAlive.valueOf(), true);
        assert.equal(isValid.valueOf(), false);
    });

    // ****************************
    // ***    With 5 options    ***
    // ****************************
    it("5 OPTIONS: should not able to vote or get status before voting starts", async () => {
        await resetToken();
        optionCount = 5;

        let now = Math.floor(Date.now() / 1000);
        voting = await Voting.new(token.address, now - 100, now + 300, optionCount, threshold, majority);

        await voting.setStartTime(now + 10);
        // Should not be able to vote
        try {
            await voting.vote(1, { from: accounts[1] });
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }

        // Should throw a error when try to get vote status
        try {
            await voting.getTotalVote();
            assert.fail();
        } catch (err) {
            console.log(err.message);
            assert.ok(/revert/.test(err.message));
        }

        await voting.setStartTime(now - 10);
    });

    it("5 OPTIONS: should be all 0 for the initial voting status", async () => {
        let s = await voting.getTotalVote();
        assert.equal(s[0].toString(10), '0');
        assert.equal(s[1].toString(10), '0');
        assert.equal(s[2].toString(10), '0');
        assert.equal(s[3].toString(10), '0');
        assert.equal(s[4].toString(10), '0');
    });

    it("5 OPTIONS: should be the balance of account after account 1 vote", async () => {
        await voting.vote(1, { from: accounts[1] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), '0');
        assert.equal(s[2].toString(10), '0');
        assert.equal(s[3].toString(10), '0');
        assert.equal(s[4].toString(10), '0');
    });

    it("5 OPTIONS: should be the balance of accounts after account 2 vote", async () => {
        await voting.vote(2, { from: accounts[2] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), '0');
        assert.equal(s[3].toString(10), '0');
        assert.equal(s[4].toString(10), '0');
    });

    it("5 OPTIONS: should be the balance of accounts after account 3 vote", async () => {
        await voting.vote(3, { from: accounts[3] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('20000000', 'ether').toString(10));
        assert.equal(s[3].toString(10), '0');
        assert.equal(s[4].toString(10), '0');
    });

    it("5 OPTIONS: should be the balance of accounts after account 4 vote", async () => {
        await voting.vote(4, { from: accounts[4] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('20000000', 'ether').toString(10));
        assert.equal(s[3].toString(10), web3.utils.toWei('25000000', 'ether').toString(10));
        assert.equal(s[4].toString(10), '0');
    });

    it("5 OPTIONS: should be the balance of accounts after account 5 vote", async () => {
        await voting.vote(5, { from: accounts[5] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('20000000', 'ether').toString(10));
        assert.equal(s[3].toString(10), web3.utils.toWei('25000000', 'ether').toString(10));
        assert.equal(s[4].toString(10), web3.utils.toWei('30000000', 'ether').toString(10));
    });

    it("5 OPTIONS: transfer some test token and check the vote result again", async () => {
        await token.transfer(accounts[1], web3.utils.toWei('5000000', 'ether'), { from: accounts[2] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('20000000', 'ether').toString(10));
        assert.equal(s[3].toString(10), web3.utils.toWei('25000000', 'ether').toString(10));
        assert.equal(s[4].toString(10), web3.utils.toWei('30000000', 'ether').toString(10));
    });


    it("5 OPTIONS: account 1 transfer some token out", async () => {
        await token.transfer(accounts[0], web3.utils.toWei('15000000', 'ether'), { from: accounts[1] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('0', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('20000000', 'ether').toString(10));
        assert.equal(s[3].toString(10), web3.utils.toWei('25000000', 'ether').toString(10));
        assert.equal(s[4].toString(10), web3.utils.toWei('30000000', 'ether').toString(10));
    });

    it("5 OPTIONS: account 4 changes its vote", async () => {
        await voting.vote(3, { from: accounts[4] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('0', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('45000000', 'ether').toString(10));
        assert.equal(s[3].toString(10), web3.utils.toWei('0', 'ether').toString(10));
        assert.equal(s[4].toString(10), web3.utils.toWei('30000000', 'ether').toString(10));

        let isAlive = await voting.isAlive();
        assert.equal(isAlive.valueOf(), true);

        let isValid = await voting.isValid();
        assert.equal(isValid.valueOf(), true);
    });

    it("5 OPTIONS: account 5 changes its vote and it should be finalized", async () => {
        await voting.vote(3, { from: accounts[5] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('0', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('75000000', 'ether').toString(10));
        assert.equal(s[3].toString(10), web3.utils.toWei('0', 'ether').toString(10));
        assert.equal(s[4].toString(10), web3.utils.toWei('0', 'ether').toString(10));

        let isAlive = await voting.isAlive();
        assert.equal(isAlive.valueOf(), false);

        let isValid = await voting.isValid();
        assert.equal(isValid.valueOf(), true);
    });

    it("5 OPTIONS: check with another proportion with valid result", async () => {
        let token = await TestToken.new();

        // Transfer some token to accounts
        await token.transfer(accounts[1], web3.utils.toWei('10000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[2], web3.utils.toWei('15000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[3], web3.utils.toWei('20000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[4], web3.utils.toWei('25000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[5], web3.utils.toWei('30000000', 'ether'), { from: accounts[0] });

        let now = Math.floor(Date.now() / 1000);
        let voting = await Voting.new(token.address, now - 100, now + 300, optionCount, threshold, majority);

        await voting.vote(1, { from: accounts[1] });
        await voting.vote(2, { from: accounts[2] });
        await voting.vote(3, { from: accounts[3] });
        await voting.vote(4, { from: accounts[4] });
        await voting.vote(5, { from: accounts[5] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('10000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('20000000', 'ether').toString(10));
        assert.equal(s[3].toString(10), web3.utils.toWei('25000000', 'ether').toString(10));
        assert.equal(s[4].toString(10), web3.utils.toWei('30000000', 'ether').toString(10));

        let isAlive = await voting.isAlive();
        isValid = await voting.isValid();
        assert.equal(isAlive.valueOf(), true);
        assert.equal(isValid.valueOf(), true);
    });

    it("5 OPTIONS: check with third proportion with invalid results", async () => {
        let token = await TestToken.new();

        // Transfer some token to accounts
        await token.transfer(accounts[1], web3.utils.toWei('5000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[2], web3.utils.toWei('1000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[3], web3.utils.toWei('2000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[4], web3.utils.toWei('15000000', 'ether'), { from: accounts[0] });
        await token.transfer(accounts[5], web3.utils.toWei('5000000', 'ether'), { from: accounts[0] });

        let now = Math.floor(Date.now() / 1000);
        let voting = await Voting.new(token.address, now - 100, now + 300, optionCount, threshold, majority);

        await voting.vote(1, { from: accounts[1] });
        await voting.vote(2, { from: accounts[2] });
        await voting.vote(3, { from: accounts[3] });
        await voting.vote(4, { from: accounts[4] });
        await voting.vote(5, { from: accounts[5] });

        let s = await voting.getTotalVote();

        assert.equal(s[0].toString(10), web3.utils.toWei('5000000', 'ether').toString(10));
        assert.equal(s[1].toString(10), web3.utils.toWei('1000000', 'ether').toString(10));
        assert.equal(s[2].toString(10), web3.utils.toWei('2000000', 'ether').toString(10));
        assert.equal(s[3].toString(10), web3.utils.toWei('15000000', 'ether').toString(10));
        assert.equal(s[4].toString(10), web3.utils.toWei('5000000', 'ether').toString(10));

        let isAlive = await voting.isAlive();
        isValid = await voting.isValid();
        assert.equal(isAlive.valueOf(), true);
        assert.equal(isValid.valueOf(), false);
    });
});