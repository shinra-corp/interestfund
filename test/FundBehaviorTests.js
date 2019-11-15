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
        await dai.transfer(proxy.address, utils.convert("1"));
        await proxy.transferToPool(fund.address, utils.convert("1"));

    });

    it('should revert on default call', async () => {
        let emitError = false;
        try {
            await fund.sendTransaction({from: accounts[0], value: 1000});
        } catch(err) {
            emitError = true;
            assert.strictEqual(err.reason.split(':')[1].trim(), 'call method directly');
        }

        if(!emitError) {
            throw ('error not emitted');
        }
    });
});