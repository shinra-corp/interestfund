const ethers = require("ethers");

module.exports = {

    namehash: function(nameString) {
        return ethers.utils.namehash(nameString);
    }
}
