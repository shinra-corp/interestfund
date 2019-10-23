const etherlime = require('etherlime-lib');
const Ownable = require("../build/SimpleContract.json");

describe('Ownable Contract Test', () => {
    let Owner = accounts[0];
    let NewOwner = accounts[1];
    let deployer;
    let contract;

    before(async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(Ownable.secretKey);
        contract = await deployer.deploy(Ownable);
    });


    it('should have a valid owner', async () => {
        let _owner = await contract.owner();
        assert.strictEqual(Owner.signer.address, _owner);
    });

    it('sould emit event of ownership transfer', async () => {
        let tx = await contract.changeOwner(NewOwner.signer.address);
        let changeOwnerResult = await contract.verboseWaitForTransaction(tx, 'changing owner');
        assert.strictEqual(changeOwnerResult.events[0].event, "ProposedNewOwner");
    });

    it('should accept new ownership', async() => {
        await contract.changeOwner(NewOwner.signer.address);
        let tx = await contract.from(NewOwner.signer).acceptOwnership();
        let acceptOwnerResult = await contract.verboseWaitForTransaction(tx, 'accepting new owner');

        assert.strictEqual(acceptOwnerResult.events[0].event, "AcceptNewOwner");

        let review_owner = await contract.owner();
        assert.strictEqual(review_owner, NewOwner.signer.address);

    });
});
