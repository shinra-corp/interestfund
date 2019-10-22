const etherlime = require('etherlime-lib');
const utils = require("./utils.js");

//Mocks
const ENS = require("../build/ENSMock");

//Contracts
const Resolver = require('../build/Resolver.json');
const FundFactory = require("../build/FundFactory.json");
const Fund = require("../build/Fund.json");
const Dispatcher = require("../build/Dispatcher.json");
const DomainController = require("../build/DomainController.json");


const deploy = async (network, secret) => {
    const rootNode = utils.namehash("interestfund.eth");

	const deployer = new etherlime.EtherlimeGanacheDeployer();

    const deployDispatcher = await deployer.deploy(Dispatcher);
	const deployResolver = await deployer.deploy(Resolver);
    const deployFundFactory = await deployer.deploy(
        FundFactory,
        {Dispatcher:deployDispatcher.contractAddress},
        deployResolver.contractAddress
    );

    const deployENS = await deployer.deploy(ENS, {}, rootNode, deployer.signer.address);

    const deployDomainController = await deployer.deploy(
        DomainController,
        {},
        rootNode,
        deployFundFactory.contractAddress,
        deployENS.contractAddress,
        deployENS.contractAddress
    );


    const changeOwner = await deployENS.setOwner(rootNode, deployDomainController.contractAddress);
    const changeOwnerResult = await deployENS.verboseWaitForTransaction(changeOwner);
    await deployENS.owner(rootNode);

    await deployFundFactory.setDomainController(deployDomainController.contractAddress);

};

module.exports = {
	deploy
};
