/*const { parseEther, formatBytes32String, bigNumberify } = require('ethers').utils;

const etherlime = require('etherlime-lib');
const ENSMock = require("../build/ENSMock.json");
const FundFactory = require("../build/FundFactory.json");
const Fund = require("../build/Fund.json");
const DomainController = require("../build/DomainController.json");
const utils = require("./utils/utils.js");
const rootNode = utils.namehash("interestfund.eth");

// compound - infrastructure
const Unitroller = require("../build/Unitroller.json");
const PriceOracle = require("../build/SimplePriceOracle.json");
const PriceOracleProxy = require("../build/PriceOracleProxy.json");
const Comptroller = require("../build/Comptroller.json");
const InterestModel = require("../build/WhitePaperInterestRateModel.json");
const CEther = require("../build/CEther.json");
const CErc20 = require("../build/CErc20.json");

const WAD = bigNumberify('1000000000000000000') // 10**18
const ETH_EXCHANGE_RATE = bigNumberify('200000000000000000000000000');

describe('Fund Contract Test', () => {

    const defaultConfigs = {
        gasprice: 20000000000, // 20 gwei
        gaslimit: 6000000
    }

    let Owner = accounts[0];
    let deployer, factory, dispatcherLib, ENS, controller, resolver;

    before(async () => {

        deployer = new etherlime.EtherlimeGanacheDeployer(Owner.secretKey, 8545, defaultConfigs);

        dispatcherLib = await deployer.deploy(Dispatcher);
        resolver = await utils.ResolverMock(deployer, accounts);

        factory = await deployer.deploy(
            FundFactory,
            { Dispatcher: dispatcherLib.contractAddress },
            resolver.contractAddress
        );

        ENS = await deployer.deploy(ENSMock, {}, rootNode, deployer.signer.address);

        controller = await deployer.deploy(
            DomainController,
            {},
            rootNode,
            factory.contractAddress,
            ENS.contractAddress,
            ENS.contractAddress
        );
        await ENS.setOwner(rootNode, controller.contractAddress);
        await factory.setDomainController(controller.contractAddress);

        // compound mocks
        const oracle = await deployer.deploy(PriceOracle);

        const comptrollerProxy = await deployer.deploy(Unitroller);
        const comptrollerImpl = await deployer.deploy(Comptroller);

        console.log('Oracle Price : ' + oracle.contractAddress);
        console.log('comptrollerProxy : ' + comptrollerProxy.contractAddress);
        console.log('comptrollerImpl : ' + comptrollerImpl.contractAddress);

        const tx = await comptrollerProxy._setPendingImplementation(comptrollerImpl.contractAddress);
        await tx.wait();
        await comptrollerProxy.pendingComptrollerImplementation();
        const txw = await comptrollerImpl._become(comptrollerProxy.contractAddress, oracle.contractAddress, WAD.div(10), 5, false);
        await txw.wait();
        const resl = await comptrollerImpl.verboseWaitForTransaction(txw);
        console.log(resl.events);
    });

    it('should run tests', async() => {
        console.log("hello");
    });
});

*/
