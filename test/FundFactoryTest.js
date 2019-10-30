const ENS = artifacts.require("ENSMock");

const FundFactory = artifacts.require("FundFactory");
const Fund = artifacts.require("Fund");
const DomainController = artifacts.require("DomainController");
const Resolver = artifacts.require("ENSResolverMock");
const DAI = artifacts.require("ERC20Mock");
const Compound = artifacts.require("CErc20");
const utils = require("./utils/utils.js");
const rootNode = utils.namehash("interestfund.eth");


contract('Fund Factory Contract Test', async accounts => {

    let Owner = accounts[0];

    let factory, resolver,ensMock, controller, dai, ctoken;

    beforeEach('preparing contracts...', async () => {

        //infrastructure contracts
        dai = await DAI.new(Owner, 10000);
        ctoken = await Compound.new(dai.address, 100);
        resolver = await Resolver.new();

        factory = await FundFactory.new(dai.address, ctoken.address);

        ensMock = await ENS.new(rootNode, Owner);

        controller = await DomainController.new(rootNode, factory.address, ensMock.address, resolver.address);

        await ensMock.setOwner(rootNode, controller.address);
        await factory.setDomainController(controller.address);
    });

    it('should have a valid configuration', async () => {
        let _owner = await factory.owner.call();
        assert.strictEqual(Owner, _owner);
        let _controller = await factory.controller.call();
        assert.strictEqual(controller.address, _controller);
    });

    it('should create a new Fund', async() => {

        let fundingName = "funding";
        let URL = utils.namehash(fundingName + '.' + 'interestfund.eth');

        let tx = await factory.newFunding(fundingName);
        assert.strictEqual(tx.logs[0].event, "NewFunding");

        let deployFund = await Fund.at(tx.logs[0].args._at);
        let manager = await deployFund.manager.call();

        assert.strictEqual(manager, Owner);

        let resolveTo = await resolver.addr(URL);
        assert.strictEqual(deployFund.address, resolveTo);
    });
    it('should emit Domain Change', async () => {
        let tx = await factory.setDomainController(Owner);
        assert.strictEqual(tx.logs[0].event, 'DomainControllerChange');
    });
    it('should emit DAI Change', async () => {
        let tx = await factory.setDAIToken(Owner);
        assert.strictEqual(tx.logs[0].event, 'DAITokenChange');
    });

    it('should emit Compound Change', async () => {
        let tx = await factory.setCompoundToken(Owner);
        assert.strictEqual(tx.logs[0].event, 'CompoundTokenChange');
    });

});
