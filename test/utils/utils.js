const resolverMock = require("../../build/Resolver.json");
const ethers = require("ethers");

module.exports = {

  addresses : {
        DAI: ['0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359','0xF5DCe57282A584D2746FaF1593d3121Fcac444dC'],
        ETH: ['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE','0x42a628e0c5F3767930097B34b08dCF77e78e4F2B'],
        BAT: ['0x0D8775F648430679A709E98d2b0Cb6250d2887EF','0x189CA88bE39C9c1B8c8dd437F5ff1DB1f584b14b'],
        REP: ['0x1985365e9f78359a9B6AD760e32412f4a445E862','0xA3C2c1618214549281E1b15dee9D682C8aa0DC1C'],
        USDC: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48','0x43a1363AFB28235720FCbDF0C2dAb7759091F7e0'],
        WBTC: ['0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599','0x43a1363AFB28235720FCbDF0C2dAb7759091F7e0'],
        ZRX: ['0xE41d2489571d322189246DaFA5ebDe1F4699F498','0xDff375162cfE7D77473C1BEC4560dEDE974E138c']
    },

    ResolverMock : async function(deployer, accounts) {

        let instance = await deployer.deploy(resolverMock);

        for(let token in this.addresses) {
            await instance.addToken(this.addresses[token][0], this.addresses[token][1]);
        }

        return instance;
    },

    namehash: function(nameString) {
        return ethers.utils.namehash(nameString);
    }
}
