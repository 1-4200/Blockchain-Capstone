var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const suppliedTokenNum = 10;
    const tokenName = "TestTokenName";
    const tokenSymbol = "TTN";
    const token_one = 1;
    const BASE_URI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new(tokenName, tokenSymbol, {from: account_one});
            for (let i = 1; i <= suppliedTokenNum; i++) {
                try {
                    await this.contract.mint(accounts[i - 1], i, {from: account_one});
                } catch (e) {
                    console.error(e.message)
                }
            }
        })

        it('should return total supply', async function () {
            const totalSupply = await this.contract.totalSupply({from: account_one});
            assert.equal(totalSupply, suppliedTokenNum, "incorrect total supply");
        })

        it('should get token balance', async function () {
            const tokenBalance = await this.contract.balanceOf(account_one, {from: account_one});
            assert.equal(tokenBalance, 1, "incorrect token balance");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            const tokenURI = await this.contract.tokenURI(token_one, {from: account_one});
            assert.equal(tokenURI, `${BASE_URI}${token_one}`, "incorrect token uri");
        })

        it('should transfer token from one owner to another', async function () {
            let ownerOf = await this.contract.ownerOf(token_one, {from: account_one});
            assert.equal(ownerOf, account_one, "owner should own before transfer token");
            try {
                await this.contract.transferFrom(account_one, account_two, token_one, {from: account_one});
            } catch (e) {
                console.error(e.message)
            }
            ownerOf = await this.contract.ownerOf(token_one, {from: account_two});
            assert.equal(ownerOf, account_two, "incorrect owner");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new(tokenName, tokenSymbol, {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {
            let isMinted = true;
            try {
                await this.contract.mint(account_two, token_one, {from: account_three});
            } catch (e) {
                isMinted = false;
            }
            assert.equal(isMinted, false, "mint should be failed");
        })

        it('should return contract owner', async function () {
            const owner = await this.contract.owner({from: account_one});
            assert.equal(owner, account_one, "incorrect contract owner");
        })

    });
})
