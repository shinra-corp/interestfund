const namehash = require('eth-ens-namehash')

module.exports = {

    namehash: function(nameString) {
        return namehash.hash(nameString);
    },

    convert: function(number) {
        return web3.utils.toWei(number);
    }
}
