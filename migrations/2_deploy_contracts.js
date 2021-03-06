const utils = require("../test/utils/utils.js");
const config = require("../config.js");
const rootNode = utils.namehash("interestfund.eth");

const FundFactory = artifacts.require("FundFactory");
const Fund = artifacts.require("Fund");
const DomainController = artifacts.require("DomainController");

const Resolver = artifacts.require("ENSResolverMock");
const ENS = artifacts.require("ENSMock");
const DAI = artifacts.require("ERC20Mock");
const Compound = artifacts.require("CErc20");

module.exports = function(deployer, network, accounts) {

    switch(network) {
        case "mainnet": _deployToMainnet(deployer, accounts); break;
        case "ropsten": _deployToRopsten(deployer, accounts); break;
        case "goerli": _deployToGoerli(deployer, accounts); break;
        default: _deployToGanache(deployer, accounts[0]); break;
    }
}


function _deployToMainnet(deployer, accounts) {
    return;
}

function _deployToRopsten(deployer, accounts) {

    let _dai, _resolver, _factory;

    console.log("Starting Ropsten Deployment");

    deployer.deploy(Resolver).then(function(instance) {
        _resolver = instance;
        return _resolver;
    }).then(function() {
        return deployer.deploy(FundFactory, config.DAI.Ropsten, config.Compound.Ropsten)
    }).then(function(instance) {
        _factory = instance;
        return deployer.deploy(FundFactory, config.DAI.Ropsten, config.Compound.Ropsten)
    }).then(function(instance) {
        deployer.deploy(DomainController, rootNode, _factory.address, config.ENS.Ropsten, _resolver.address);
    });
}

function _deployToGoerli(deployer, accounts) {
    return;
}

//If deployment to private network than deploy also mocks contracts
function _deployToGanache(deployer, owner) {

    let _dai, _ctoken, _resolver, _factory, _ensMock, _controller;

    console.log("Starting Ganache Deployment");

    let supplyRate = "2000000000";

    deployer.deploy(Resolver).then(function(instance) {
        _resolver = instance;
    });

    deployer.deploy(DAI, owner, "10000000000000000000").then(function(instance) {
        _dai = instance;
        return deployer.deploy(Compound, instance.address, supplyRate);
    }).then(function(instance) {
        _ctoken = instance;
        return deployer.deploy(FundFactory, _dai.address, instance.address);
    }).then(function(instance) {
        _factory = instance;
        return deployer.deploy(ENS, rootNode, owner);
    }).then(function(instance) {
        _ensMock = instance;
        return deployer.deploy(DomainController, rootNode, _factory.address, _ensMock.address, _resolver.address);
    });

}
