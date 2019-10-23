const etherlime = require('etherlime-lib');
const Ownable = require("../build/Resolver.json");
const utils = require("./utils/utils.js");

describe('Token Resolver Test', () => {
    let firstAccount = accounts[0];
    let secondAccount = accounts[1];
    let deployer;
    let Ownabl;


    before(async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(firstAccount.secretKey);
        resolver = await utils.ResolverMock(deployer, accounts);
    });


    it('should have a valid owner', async () => {
        let owner = await resolver.owner();
        assert.strictEqual(owner, firstAccount.signer.address);
    });


    it('should have the correct tokens resolvers', async() => {

        let daiResolver = await resolver.resolveToken(utils.addresses.DAI[0]);
        let ethResolver = await resolver.resolveToken(utils.addresses.ETH[0]);
        let batResolver = await resolver.resolveToken(utils.addresses.BAT[0]);
        let repResolver = await resolver.resolveToken(utils.addresses.REP[0]);
        let usdcResolver = await resolver.resolveToken(utils.addresses.USDC[0]);
        let wbtcResolver = await resolver.resolveToken(utils.addresses.WBTC[0]);
        let zrxResolver = await resolver.resolveToken(utils.addresses.ZRX[0]);

        assert.strictEqual(utils.addresses.DAI[1], daiResolver);
        assert.strictEqual(utils.addresses.ETH[1], ethResolver);
        assert.strictEqual(utils.addresses.BAT[1], batResolver);
        assert.strictEqual(utils.addresses.REP[1], repResolver);
        assert.strictEqual(utils.addresses.USDC[1], usdcResolver);
        assert.strictEqual(utils.addresses.WBTC[1], wbtcResolver);
        assert.strictEqual(utils.addresses.ZRX[1], zrxResolver);
    });

    it('should operate resolvers', async() => {
        await resolver.addToken(firstAccount.signer.address, secondAccount.signer.address);

        let fake = await resolver.resolveToken(firstAccount.signer.address);

        assert.strictEqual(secondAccount.signer.address, fake);

    });

    it('should return list by index', async () => {
        let daiToken = await resolver.tokens(0);

        assert.strictEqual(utils.addresses.DAI[0], daiToken);
    });

});
