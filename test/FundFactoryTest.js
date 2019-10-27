const ENS = require("../build/ENSMock");

const etherlime = require('etherlime-lib');
const FundFactory = require("../build/FundFactory.json");
const Fund = require("../build/Fund.json");
const DomainController = require("../build/DomainController.json");
const Resolver = require("../build/ENSResolverMock.json");
const DAI = require("../build/ERC20Mock.json");
const Compound = require("../build/CErc20.json");
const utils = require("./utils/utils.js");
const rootNode = utils.namehash("interestfund.eth");

describe('Fund Factory Contract Test', () => {

    let Owner = accounts[0];
    let deployer, factory, resolver,ensMock, controller, dai, ctoken;

    before(async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(Owner.secretKey);

        //infrastructure contracts
        dai = await deployer.deploy(DAI, {}, Owner.signer.address, 10000);
        ctoken = await deployer.deploy(Compound, {}, dai.contractAddress, 100);
        resolver = await deployer.deploy(Resolver, {});


        factory = await deployer.deploy(
            FundFactory,
            {},
            dai.contractAddress,
            ctoken.contractAddress
        );

        ensMock = await deployer.deploy(ENS, {}, rootNode, deployer.signer.address);

        controller = await deployer.deploy(
            DomainController,
            {},
            rootNode,
            factory.contractAddress,
            ensMock.contractAddress,
            resolver.contractAddress
        );

        await ensMock.setOwner(rootNode, controller.contractAddress);
        await factory.setDomainController(controller.contractAddress);
    });

    it('should have a valid configuration', async () => {
        let _owner = await factory.owner();
        assert.strictEqual(Owner.signer.address, _owner);
        let _controller = await factory.controller();
        assert.strictEqual(controller.contractAddress, _controller);
    });

    it('should create a new Fund', async() => {
        let tx = await factory.newFunding("Funding");
        let result = await factory.verboseWaitForTransaction(tx, 'creating new fund');

        assert.strictEqual(result.events[2].event, "NewFunding");

        let deployFund = await etherlime.ContractAt(Fund, result.events[2].args._at)
        let manager = await deployFund.manager();

        assert.strictEqual(manager, Owner.signer.address);
    });

    it('should emit Domain Change', async () => {
        let tx = await factory.setDomainController(Owner.signer.address);
        let result = await factory.verboseWaitForTransaction(tx, 'change Domain controller');
        assert.strictEqual(result.events[0].event, 'DomainControllerChange');
    });
});
