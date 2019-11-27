const ENS = artifacts.require("ENSMock");

const FundFactory = artifacts.require("FundFactory");
const Fund = artifacts.require("Fund");
const DomainController = artifacts.require("DomainController");
const Resolver = artifacts.require("ENSResolverMock");
const DAI = artifacts.require("ERC20Mock");
const Compound = artifacts.require("CErc20");
const Liquidity = artifacts.require("LiquidityProvider");
const utils = require("./utils/utils.js");
const rootNode = utils.namehash("interestfund.eth");
const URI = "funding";

const supplyRate = utils.convert("0.0002");
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract('Fund Contract Behavior Test', async accounts  => {

    let Owner = accounts[0];
    let factory, resolver,ensMock, controller, dai, ctoken;

    beforeEach('preparing contracts...', async () => {

        //infrastructure contracts
        dai = await DAI.new(Owner, 10000);
        ctoken = await Compound.new(dai.address, 100);
        resolver = await Resolver.new();

        factory = await FundFactory.new(dai.address, ctoken.address);
    });

    it('should revert in instantiation without dai address', async () => {
        let emitError = false;
        try {
            await FundFactory.new(ZERO_ADDRESS, ctoken.address);
        } catch(err) {
            emitError = true;
            assert.strictEqual(err.reason.split(':')[1].trim(), 'DAI Address invalid');
        }

        if(!emitError) {
            throw ('error not emitted');
        }
    });

    it('should revert in instantiation without ctoken address', async () => {
        let emitError = false;
        try {
            await FundFactory.new(dai.address, ZERO_ADDRESS);
        } catch(err) {
            emitError = true;
            assert.strictEqual(err.reason.split(':')[1].trim(), 'Compound Token invalid');
        }

        if(!emitError) {
            throw ('error not emitted');
        }
    });

    it('should revert without DAI address', async () => {
        let emitError = false;
        try {
            await factory.setDAIToken(ZERO_ADDRESS);
        } catch(err) {
            emitError = true;
            assert.strictEqual(err.reason.split(':')[1].trim(), 'DAI Address invalid');
        }

        if(!emitError) {
            throw ('error not emitted');
        }
    });

    it('should revert without Compound address', async () => {
        let emitError = false;
        try {
            await factory.setCompoundToken(ZERO_ADDRESS);
        } catch(err) {
            emitError = true;
            assert.strictEqual(err.reason.split(':')[1].trim(), 'Compound Token invalid');
        }

        if(!emitError) {
            throw ('error not emitted');
        }
    });
});
