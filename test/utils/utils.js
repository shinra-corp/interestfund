const namehash = require('eth-ens-namehash')
const web3 = require('web3');

module.exports = {

    namehash: function(nameString) {
        return namehash.hash(nameString);
    },

    convert: function(number) {
        return web3.utils.toWei(number);
    }
}
