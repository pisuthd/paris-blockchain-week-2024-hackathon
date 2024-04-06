const {
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
} = require('@solana/web3.js')
const HOST_URL = "http://localhost:8899"

const getAirdrop = async (connection, account) => {

    const airdropSignature = await connection.requestAirdrop(
        account.publicKey,
        LAMPORTS_PER_SOL,
    );

    await connection.confirmTransaction({
        signature: airdropSignature,
        ...(await connection.getLatestBlockhash()),
    });

}

exports.HOST_URL = HOST_URL

exports.getAirdrop = getAirdrop

