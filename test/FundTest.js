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
const URI = "funding";

const supplyRate = utils.convert('0.0002').toString();

describe('Fund Contract Test', () => {

    let Owner = accounts[0];

    let donor1 = accounts[1];
    let donor2 = accounts[2];
    let donor3 = accounts[3];

    let deployer, factory, fund, resolver,ensMock, controller, dai, ctoken;

    before(async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(Owner.secretKey);

        //infrastructure contracts
        dai = await deployer.deploy(DAI, {}, Owner.signer.address, 10000);
        ctoken = await deployer.deploy(Compound, {}, dai.contractAddress, supplyRate);
        resolver = await deployer.deploy(Resolver, {});

        //give dai tokens to donors
        await dai.mint(donor1.signer.address, utils.convert("1.0"));
        await dai.mint(donor2.signer.address, utils.convert("1.0"));
        await dai.mint(donor3.signer.address, utils.convert("1.0"));

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

        let tx = await factory.newFunding(URI);
        let result = await factory.verboseWaitForTransaction(tx, 'creating new fund');

        fund = await etherlime.ContractAt(Fund, result.events[3].args._at)

    });

    it('should have a valid configuration', async () => {
        let _owner = await fund.manager();
        assert.strictEqual(Owner.signer.address, _owner);
    });

    it('should maintain correct funding', async () => {
        await dai.from(donor1.signer.address).approve(fund.contractAddress, utils.convert("0.05").toString());
        await dai.from(donor2.signer.address).approve(fund.contractAddress, utils.convert("0.05").toString());
        await dai.from(donor3.signer.address).approve(fund.contractAddress, utils.convert("0.05").toString());

        await fund.from(donor1.signer.address).funding(utils.convert("0.05").toString());
        await fund.from(donor2.signer.address).funding(utils.convert("0.004").toString());
        await fund.from(donor3.signer.address).funding(utils.convert("0.001").toString());

        //Balances should be equals to funds
        let balanceFund = await fund.totalBalances();
        //let fake_interest = balanceFund * supplyRate;

        //console.log(fake_interest);
        //console.log(utils.convert("0.05"));
        let balanceCompound = await ctoken.balanceOf(fund.contractAddress);
        //should have balance + interest
        assert.ok(balanceFund.eq(balanceCompound), 'Balance Compound Token should sum up');

        await fund.from(donor1.signer.address).withdraw(utils.convert("0.025"));

        let donor1Balance = await fund.balanceOf(donor1.signer.address);
        assert.ok(utils.convert("0.025").eq(donor1Balance), 'eating user funds');

        let balanceFundAfterWithdraw = await fund.totalBalances();
        let balanceCompoundAfterWithdraw = await ctoken.balanceOf(fund.contractAddress);

        assert.ok(balanceFundAfterWithdraw.eq(balanceCompoundAfterWithdraw), 'Balance Compound after withdraw should sum up')

        //withdraw all balances
        await fund.from(donor1.signer.address).withdraw(utils.convert("0.025").toString());
        await fund.from(donor2.signer.address).withdraw(utils.convert("0.004").toString());
        await fund.from(donor3.signer.address).withdraw(utils.convert("0.001").toString());

        let finalBalance1 = await fund.balanceOf(donor1.signer.address);
        let finalBalance2 = await fund.balanceOf(donor2.signer.address);
        let finalBalance3 = await fund.balanceOf(donor3.signer.address);

        assert.equal(finalBalance1.toNumber() + finalBalance2.toNumber() + finalBalance3.toNumber(),  0, 'Final Balances Users incrrect');
    });
});
