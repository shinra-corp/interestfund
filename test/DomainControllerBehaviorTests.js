const ENS = artifacts.require("ENSMock");

const FundFactory = artifacts.require("FundFactory");
const Fund = artifacts.require("Fund");
const DomainController = artifacts.require("DomainController");
const Resolver = artifacts.require("ENSResolverMock");
const DAI = artifacts.require("ERC20Mock");
const Compound = artifacts.require("CErc20");
const utils = require("./utils/utils.js");
const rootNode = utils.namehash("interestfund.eth");


contract('Domain Controller Behavior Contract Test', async accounts => {

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
        await controller.newSubDomain(label, resolver.address, manager);

    });

    it('should revert with a duplicate label', async () => {

        let emitError = false;

        try {
            await controller.newSubDomain(label, resolver.address, manager);
        } catch(err) {
            emitError = true;
            assert.strictEqual(err.reason.split(':')[1].trim(), 'Subdomain registry');
        }

        if(!emitError) {
            throw ('error not emitted');
        }
    });

    it('should revert with invalid asker account', async () => {

        let emitError = false;

        try {
            await controller.changeAsker('0x0000000000000000000000000000000000000000');
        } catch(err) {
            emitError = true;
            assert.strictEqual(err.reason.split(':')[1].trim(), 'Invalid address');
        }

        if(!emitError) {
            throw ('error not emitted');
        }
    });

    it('should revert if not asker', async () => {
        let emitError = false;

        try {
            await controller.newSubDomain(label, resolver.address, manager, {from: accounts[5]});
        } catch(err) {
            emitError = true;
            assert.strictEqual(err.reason.split(':')[1].trim(), 'not contract call');
        }

        if(!emitError) {
            throw ('error not emitted');
        }

    });
});
