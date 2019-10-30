const Ownable = artifacts.require("SimpleContract");

contract('Ownable Contract Test', async accounts => {

    let Owner = accounts[0];
    let NewOwner = accounts[1];
    let contract;

    beforeEach('preparing contracts...', async () => {
        contract = await Ownable.new();
    });

    it('should have a valid owner', async () => {
        let _owner = await contract.owner.call();
        assert.strictEqual(Owner, _owner);
    });

    it('sould emit event of ownership transfer', async () => {
        let tx = await contract.changeOwner(NewOwner);
        assert.strictEqual(tx.logs[0].event, "ProposedNewOwner");
    });

    it('should accept new ownership', async() => {
        await contract.changeOwner(NewOwner);
        let tx = await contract.acceptOwnership({from : NewOwner});
        assert.strictEqual(tx.logs[0].event, "AcceptNewOwner");

        let review_owner = await contract.owner.call();
        assert.strictEqual(review_owner, NewOwner);

    });
});
