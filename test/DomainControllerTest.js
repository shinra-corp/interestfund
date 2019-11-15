const ENS = artifacts.require("ENSMock");

const FundFactory = artifacts.require("FundFactory");
const Fund = artifacts.require("Fund");
const DomainController = artifacts.require("DomainController");
const Resolver = artifacts.require("ENSResolverMock");
const DAI = artifacts.require("ERC20Mock");
const Compound = artifacts.require("CErc20");
const utils = require("./utils/utils.js");
const rootNode = utils.namehash("interestfund.eth");


contract('Domain Controller Contract Test', async accounts => {

    let Asker = accounts[0];
    let manager = accounts[1];
    let label = 'test';

    let resolver, ensMock, controller;

    beforeEach('preparing contracts...', async () => {

        //infrastructure contracts
        resolver = await Resolver.new();
        ensMock = await ENS.new(rootNode, Asker);
        controller = await DomainController.new(rootNode, Asker, ensMock.address, resolver.address);

        await ensMock.setOwner(rootNode, controller.address);

    });

    it('should register a subdomain', async () => {

        let tx = await controller.newSubDomain(label, resolver.address, manager);
        let _manager = tx.logs[0].args.manager;
        let _label = tx.logs[0].args.label;

        assert.strictEqual(_manager, manager, 'Manager of subdomain not the samea');
        assert.strictEqual(_label, label, 'label of subdomain not the samea');
    });

    it('should transfer the root domain to another user', async () => {

        let tx = await controller.transferDomain()
        let newOwner = tx.logs[0].args.newOwner;

        assert.strictEqual(newOwner, Asker, 'Ownership transfer failed');

    });

    it('should change contract that can ask for subdomain', async () => {
        let _newAsker = accounts[5];
        await controller.changeAsker(_newAsker);
        let _asker = await controller.asker.call();
        assert.strictEqual(_newAsker, _asker, 'Wrong asker addrres');
    });

});
