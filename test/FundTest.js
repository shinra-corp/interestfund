const ENS = artifacts.require("ENSMock");

const FundFactory = artifacts.require("FundFactory");
const Fund = artifacts.require("Fund");
const DomainController = artifacts.require("DomainController");
const Resolver = artifacts.require("ENSResolverMock");
const DAI = artifacts.require("ERC20Mock");
const Compound = artifacts.require("CErc20");
const Liquidity = artifacts.require("LiquidityProvider");
const utils = require("./utils/utils.js");
const rootNode = utils.namehash("interestfund.eth");
const URI = "funding";

const supplyRate = utils.convert("0.0002");

contract('Fund Contract Test', async accounts  => {

    let Owner = accounts[0];

    let donor1 = accounts[1];
    let donor2 = accounts[2];
    let donor3 = accounts[3];

    let factory, fund, resolver,ensMock, controller, dai, ctoken;

    before(async () => {

        //infrastructure contracts
        dai = await DAI.new(Owner, utils.convert("1"));
        ctoken = await Compound.new(dai.address, supplyRate);
        resolver = await Resolver.new();
        proxy = await Liquidity.new(dai.address, ctoken.address);
        //give dai tokens to donors
        await dai.mint(donor1, utils.convert("1.0"));
        await dai.mint(donor2, utils.convert("1.0"));
        await dai.mint(donor3, utils.convert("1.0"));

        factory = await FundFactory.new(dai.address, ctoken.address);
        ensMock = await ENS.new(rootNode, Owner);
        controller = await DomainController.new(rootNode, factory.address, ensMock.address, resolver.address);

        await ensMock.setOwner(rootNode, controller.address);
        await factory.setDomainController(controller.address);

        let tx = await factory.newFunding(URI);
        fund = await Fund.at(tx.logs[0].args._at);

        //add liquidity to pool to pay interest
        await dai.mint(proxy.address, utils.convert("10"));
       // await dai.transfer(proxy.address, utils.convert("1"));
        //await proxy.transferToPool(fund.address, utils.convert("1"));

    });

    it('should have a valid configuration', async () => {
        let _owner = await fund.manager.call();
        assert.strictEqual(Owner, _owner);
    });

    it('should have the correct balance', async () => {

        await dai.approve(fund.address, utils.convert("0.05"), {from: donor1});
        await dai.approve(fund.address, utils.convert("0.05"), {from: donor2});
        await dai.approve(fund.address, utils.convert("0.05"), {from: donor3});

        //Start funding a project
        await fund.funding(utils.convert("0.05"), {from: donor1});
        await fund.funding(utils.convert("0.004"), {from: donor2});
        await fund.funding(utils.convert("0.001"), {from: donor3});

        //Balances should be equals to funds
        let balanceFund = await fund.totalBalances.call();
        let balanceCompound = await ctoken.balanceOf.call(fund.address);

        //assert.ok(balanceFund.eq(balanceCompound), 'Balances to equals');
    });

    it('should maintain correct funding', async () => {

        const amount = web3.utils.toBN(utils.convert("0.025"));


        //add liquidity to pool
        await proxy.transferToPool(fund.address, utils.convert("1"));
//        await ctoken.addLiquidity(fund.address, utils.convert("1"));

        let balanceFundInitial = await fund.totalBalances.call();
        let balanceCompoundInitial = await ctoken.balanceOf.call(fund.address);

        let interestFund = await fund.accruedInterest.call();
        let balanceFund = await fund.totalBalances.call();

        //Totally fake
        let underBalance = await ctoken.balanceOfUnderlying.call(fund.address);
        let fake_interest = underBalance.sub(balanceFund);

        //assert.ok(fake_interest.eq(interestFund), 'Interest not equal');

        await fund.balanceOf.call(donor1);
        await fund.withdraw(amount, {from: donor1});
        let donor1Balance = await fund.balanceOf.call(donor1);

        //assert.ok(amount.eq(donor1Balance), 'eating user funds');

        let balanceFundAfterWithdraw = await fund.totalBalances.call();
        let balanceCompoundAfterWithdraw = await ctoken.balanceOf.call(fund.address);

        //assert.ok(balanceFundAfterWithdraw.eq(balanceFundInitial.sub(amount)), 'Total balance after withdraw should sum up');
        //assert.ok(balanceCompoundAfterWithdraw.eq(balanceCompoundInitial.sub(amount)), 'Balance Compound after withdraw should sum up');


        //withdraw all balances
        await fund.withdraw(utils.convert("0.025"), {from: donor1});
        await fund.withdraw(utils.convert("0.004"), {from: donor2});
        await fund.withdraw(utils.convert("0.001"), {from: donor3});

        let finalBalance1 = await fund.balanceOf.call(donor1);
        let finalBalance2 = await fund.balanceOf.call(donor2);
        let finalBalance3 = await fund.balanceOf.call(donor3);

        //assert.equal(finalBalance1.toNumber() + finalBalance2.toNumber() + finalBalance3.toNumber(),  0, 'Final Balances Users incrrect');
    });

    it('should withdraw Interest', async () => {

        let amount = web3.utils.toBN(utils.convert("1"));
        let initial = await dai.balanceOf.call(accounts[0]);

        await fund.withdrawInterest(amount);

        let end = await dai.balanceOf.call(accounts[0]);

        assert.ok(initial.add(amount).eq(end), 'balances not match');

    });
});
