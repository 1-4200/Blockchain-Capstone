const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const Verifier = artifacts.require("Verifier");
const proofJson = require("./proof");

contract("TestSolnSquareVerifier", accounts => {
    const account_one = accounts[0]
    const account_two = accounts[1]

    const proof = proofJson.proof;
    const correctProofInputs = proofJson.inputs;
    const tokenName = "TestTokenName";
    const tokenSymbol = "TTN";
    const tokenId = 1;

    describe("proof", function () {
        beforeEach(async function () {
            const verifier = await Verifier.new({from: account_one});
            this.contract = await SolnSquareVerifier.new(verifier.address, tokenName, tokenSymbol, {from: account_one});
        });

        it("Test if a new solution can be added for contract", async function () {
            let tx = "";
            try {
                tx = await this.contract.addSolution(proof.a, proof.b, proof.c, correctProofInputs, {from: account_one});
            } catch (e) {
                console.error(e.message);
            }
            assert.equal(tx.logs[0].event, "SolutionAdded", "solution is not added");
        });

        it("Test if an ERC721 token can be minted for contract", async function () {
            await this.contract.mintNFT(account_two, tokenId, proof.a, proof.b, proof.c, correctProofInputs, {from: account_one});
            const onwerOf = await this.contract.ownerOf(tokenId);
            assert.equal(onwerOf, account_two, "token is not minted correctly");
        });
    });
});
