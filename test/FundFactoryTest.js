const ENS = require("../build/ENSMock");

const etherlime = require('etherlime-lib');
const FundFactory = require("../build/FundFactory.json");
const Dispatcher = require("../build/Dispatcher.json");
const TokenResolver = require("../build/Resolver.json");
const DomainController = require("../build/DomainController.json");
const utils = require("./utils/utils.js");
const rootNode = utils.namehash("interestfund.eth");

describe('Fund Factory Contract Test', () => {


    let Owner = accounts[0];
    let deployer;
    let factory;
    let dispatcherLib;
    let ensMock;
    let controller;
    let resolver;

    before(async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(Owner.secretKey);

        dispatcherLib = await deployer.deploy(Dispatcher);
        resolver = await utils.ResolverMock(deployer, accounts);
        factory = await deployer.deploy(
            FundFactory,
            { Dispatcher:dispatcherLib.contractAddress },
            resolver.contractAddress
        );

        ensMock = await deployer.deploy(ENS, {}, rootNode, deployer.signer.address);

        controller = await deployer.deploy(
            DomainController,
            {},
            rootNode,
            factory.contractAddress,
            ensMock.contractAddress,
            ensMock.contractAddress
        );

        await ensMock.setOwner(rootNode, controller.contractAddress);
        await factory.setDomainController(controller.contractAddress);

    });

    it('should have a valid owner', async () => {
        let _owner = await factory.owner();
        assert.strictEqual(Owner.signer.address, _owner);
    });

    it('should create a new Fund', async() => {
        let tx = await factory.newFunding("Funding");
        let result = await factory.verboseWaitForTransaction(tx, 'creating new fund');
        assert.strictEqual(result.events[2].event, "NewFunding");
    });

});

