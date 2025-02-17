const { Connection, PublicKey, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const fs = require('fs');
const assert = require('assert');

describe('Token Tests', () => {
    let connection;
    let payer;
    let token;
    let tokenAccount;

    before(async () => {
        connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
        payer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('path/to/payer-keypair.json'))));
        const mintAuthority = Keypair.generate();
        const freezeAuthority = Keypair.generate();

        token = await Token.createMint(
            connection,
            payer,
            mintAuthority.publicKey,
            freezeAuthority.publicKey,
            9,
            TOKEN_PROGRAM_ID
        );

        tokenAccount = await token.createAccount(payer.publicKey);
        await token.mintTo(tokenAccount, payer.publicKey, [], 4000000 * Math.pow(10, 9));
    });

    it('should mint 4 million tokens', async () => {
        const accountInfo = await token.getAccountInfo(tokenAccount);
        assert.equal(accountInfo.amount.toString(), '4000000000000000');
    });

    it('should burn 1 million tokens', async () => {
        await token.burn(tokenAccount, payer.publicKey, [], 1000000 * Math.pow(10, 9));
        const accountInfo = await token.getAccountInfo(tokenAccount);
        assert.equal(accountInfo.amount.toString(), '3000000000000000');
    });
});