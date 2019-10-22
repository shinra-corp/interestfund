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


	const deployer = new etherlime.EtherlimeGanacheDeployer();
    const asFundFactory = deployer.signer;


    const deployDispatcher = await deployer.deploy(Dispatcher);
	const deployResolver = await deployer.deploy(Resolver);
    const deployFundFactory = await deployer.deploy(
        FundFactory,
        {Dispatcher:deployDispatcher.contractAddress},
        deployResolver.contractAddress
    );

    const deployENS = await deployer.deploy(ENS, {}, utils.namehash("interestfund.eth"), deployFundFactory.contractAddress);
    const deployDomainController = await deployer.deploy(
        DomainController,
        {},
        utils.namehash("interestfund.eth"),
        deployFundFactory.contractAddress,
        deployENS.contractAddress,
        deployENS.contractAddress
    );
    let s = await deployDomainController.ret();
    console.log(s);

};

module.exports = {
	deploy
};
