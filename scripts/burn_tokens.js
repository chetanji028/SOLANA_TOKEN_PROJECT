const { Connection, PublicKey, Keypair, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const fs = require('fs');

async function burnTokens() {
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const payer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('path/to/payer-keypair.json'))));

    const mintAddress = new PublicKey('YOUR_MINT_ADDRESS_HERE');
    const token = new Token(connection, mintAddress, TOKEN_PROGRAM_ID, payer);

    const tokenAccount = new PublicKey('YOUR_TOKEN_ACCOUNT_ADDRESS_HERE');

    // Burn 1 million tokens
    await token.burn(tokenAccount, payer.publicKey, [], 1000000 * Math.pow(10, 9));
    console.log('1 million tokens burned successfully');
}

burnTokens().catch(err => {
    console.error(err);
});