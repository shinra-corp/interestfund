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
        ctoken = await deployer.deploy(Compound, {}, dai.contractAddress, 1);
        resolver = await deployer.deploy(Resolver, {});

        //give dai tokens to donors
        await dai.mint(donor1.signer.address, 1000);
        await dai.mint(donor2.signer.address, 1000);
        await dai.mint(donor3.signer.address, 1000);

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
        await dai.from(donor1.signer.address).approve(fund.contractAddress, 500);
        await dai.from(donor2.signer.address).approve(fund.contractAddress, 500);
        await dai.from(donor3.signer.address).approve(fund.contractAddress, 500);

        await fund.from(donor1.signer.address).funding(500);
        await fund.from(donor2.signer.address).funding(250);
        await fund.from(donor3.signer.address).funding(50);

        //Balances should be equals to funds
        let balanceFund = await fund.totalBalances();
        let balanceCompound = await ctoken.balanceOf(fund.contractAddress);

        assert.equal(balanceFund.toNumber(), balanceCompound.toNumber(), 'Balance should sum up');

        await fund.from(donor1.signer.address).withdraw(250);

        let donor1Balance = await fund.balanceOf(donor1.signer.address);

        assert.equal(250, donor1Balance.toNumber(), 'eating user funds');

        let balanceFundAfterWithdraw = await fund.totalBalances();
        let balanceCompoundAfterWithdraw = await ctoken.balanceOf(fund.contractAddress);

        assert.equal(balanceFundAfterWithdraw.toNumber(), balanceCompoundAfterWithdraw.toNumber(), 'Balance should sum up')
        assert.equal(550, balanceFundAfterWithdraw.toNumber(), 'Balance incorrect');

        //withdraw all balances
        await fund.from(donor1.signer.address).withdraw(250);
        await fund.from(donor2.signer.address).withdraw(250);
        await fund.from(donor3.signer.address).withdraw(50);

        let finalBalance1 = await fund.balanceOf(donor1.signer.address);
        let finalBalance2 = await fund.balanceOf(donor2.signer.address);
        let finalBalance3 = await fund.balanceOf(donor3.signer.address);

        assert.equal(finalBalance1.toNumber() + finalBalance2.toNumber() + finalBalance3.toNumber(),  0, 'Final Balances Users incrrect');

        //should have only interest or zero
        let finalFundBalance = await ctoken.balanceOf(fund.contractAddress);

        assert.equal(0, finalFundBalance.toNumber(), 'should have no ctoken');
    });
});
