const Verifier = artifacts.require("Verifier");
const proofJson = require("./proof");

contract("TestVerifier", accounts => {
    const owner = accounts[0]

    const proof = proofJson.proof;
    const correctProofInputs = proofJson.inputs;
    const incorrectProofInputs = [5, 2];

    describe("zokrates proof", function () {
        beforeEach(async function () {
            this.contract = await Verifier.new({from: owner});
        });

        it("should correct proof work", async function () {
            const isWorked = await this.contract.verifyTx.call(proof.a, proof.b, proof.c, correctProofInputs, {from: owner});
            assert.equal(isWorked, true, "proof doesn't work");
        });

        it("should correct proof work", async function () {
            const isWorked = await this.contract.verifyTx.call(proof.a, proof.b, proof.c, incorrectProofInputs, {from: owner});
            assert.equal(isWorked, false, "proof work");
        });
    });
});
