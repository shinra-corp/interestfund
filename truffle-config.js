require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = process.env.API;
const PrivKey = process.env.PrivKey;

module.exports = {

  networks: {

     development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },

     coverage: {
          host: "localhost",
          network_id: "*",
          port: 8555,         // <-- If you change this, also set the port option in .solcover.js.
          gas: 0xfffffffffff, // <-- Use this high gas value
          gasPrice: 0x01      // <-- Use this low gas price
     },

     ropsten: {
       provider: () => new HDWalletProvider(PrivKey, 'https://ropsten.infura.io/v3/' + infuraKey),
       network_id: 3,       // Ropsten's id
       gas: 5500000,        // Ropsten has a lower block limit than mainnet
       confirmations: 2,    // # of confs to wait between deployments. (default: 0)
       timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
       skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },

    // Another network with more advanced options...
    // advanced: {
      // port: 8777,             // Custom port
      // network_id: 1342,       // Custom network
      // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
      // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
      // from: <address>,        // Account to send txs from (default: accounts[0])
      // websockets: true        // Enable EventEmitter interface for web3 (default: false)
    // },
      //
    },

  // Set default mocha options here, use special reporters etc.
  mocha: {
     timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
       version: "0.5.11",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}
