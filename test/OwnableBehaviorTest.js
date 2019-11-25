const Ownable = artifacts.require("SimpleContract");

contract('Ownable Behavior Contract Test', async accounts => {

    let Owner = accounts[0];
    let NewOwner = accounts[1];
    let contract;

    beforeEach('preparing contracts...', async () => {
        contract = await Ownable.new();
    });

/*    it('should revert with a duplicate label', async () => {

        let emitError = false;

        try {
            await controller.newSubDomain(label, resolver.address, manager);
        } catch(err) {
            emitError = true;
            assert.strictEqual(err.reason.split(':')[1].trim(), 'Subdomain registry');
        }

        if(!emitError) {
            throw ('error not emitted');
        }
    });
    */

    it('should revert with invalid Owner account', async () => {

        let emitError = false;

        try {
            await contract.changeOwner('0x0000000000000000000000000000000000000000');
        } catch(err) {
            emitError = true;
            assert.strictEqual(err.reason.split(':')[1].trim(), 'Invalid address');
        }

        if(!emitError) {
            throw ('error not emitted');
        }
    });

    it('should revert if not owner', async () => {
        let emitError = false;

        try {
            await contract.addCounter({from: accounts[5]});
        } catch(err) {
            emitError = true;
            assert.strictEqual(err.reason.split(':')[1].trim(), 'not owner');
        }

        if(!emitError) {
            throw ('error not emitted');
        }

    });
});
