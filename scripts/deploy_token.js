const { Connection, PublicKey, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const fs = require('fs');

async function deployToken() {
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const payer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('path/to/payer-keypair.json'))));

    const mintAuthority = Keypair.generate();
    const freezeAuthority = Keypair.generate();

    const token = await Token.createMint(
        connection,
        payer,
        mintAuthority.publicKey,
        freezeAuthority.publicKey,
        9, // Decimals
        TOKEN_PROGRAM_ID
    );

    console.log(`Token Mint Address: ${token.publicKey.toBase58()}`);

    // Create a token account for the payer
    const tokenAccount = await token.createAccount(payer.publicKey);
    console.log(`Token Account Address: ${tokenAccount.toBase58()}`);

    // Mint 4 million tokens to the payer's token account
    await token.mintTo(tokenAccount, payer.publicKey, [], 4000000 * Math.pow(10, 9));
    console.log('4 million tokens minted successfully');
}

deployToken().catch(err => {
    console.error(err);
});