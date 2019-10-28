const ethers = require("ethers");

module.exports = {

    namehash: function(nameString) {
        return ethers.utils.namehash(nameString);
    },

    convert: function(number) {
        return ethers.utils.parseEther(number);
    }
}
