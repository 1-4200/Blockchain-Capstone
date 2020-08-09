// migrating the appropriate contracts
const SquareVerifier = artifacts.require("./Verifier.sol");
const SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
const tokenName = "TestTokenName";
const tokenSymbol = "TTN";

module.exports = function (deployer) {
    deployer.deploy(SquareVerifier).then(() => {
        deployer.deploy(SolnSquareVerifier, SquareVerifier.address, tokenName, tokenSymbol);
    });
};
