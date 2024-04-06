const {
    Connection,
    Keypair,
    sendAndConfirmTransaction
} = require('@solana/web3.js')

const {
    ExtensionType,
    createInitializeMintInstruction,
    mintTo,
    createAccount,
    getAccount,
    getMintLen,
    getTransferFeeAmount,
    unpackAccount,
    TOKEN_2022_PROGRAM_ID,
} = require('@solana/spl-token')

const { deployToken, getAirdrop, HOST_URL } = require("../lib/surfer.js")

describe('#usd-silver-surfer', function () {

    let payer
    let minter

    let mint

    before(async () => {

        payer = Keypair.generate()
        minter = Keypair.generate()

        mint = minter.publicKey

        connection = new Connection(HOST_URL)

    })

    it('Setting up coin success', async () => {

        await getAirdrop(connection, payer)

        const mintTransaction = await deployToken({
            connection,
            payer,
            mint,
            tokenName: "USD Silver Surfer",
            tokenSymbol: "USD-SILVER",
            tokenUri: "RANDOM URI HERE"
        })

        const sig = await sendAndConfirmTransaction(connection, mintTransaction, [payer, minter]);
        console.log('Signature:', sig);

    })

    it('Minting coin success', async () => {
        
        const mintAmount = BigInt(1_000_000_000);
        const owner = Keypair.generate();
        const sourceAccount = await createAccount(
            connection,
            payer,
            mint,
            owner.publicKey,
            undefined,
            undefined,
            TOKEN_2022_PROGRAM_ID
        );
        await mintTo(
            connection,
            payer,
            mint,
            sourceAccount,
            payer.publicKey,
            mintAmount,
            [],
            undefined,
            TOKEN_2022_PROGRAM_ID
        );
        
    })

    // TODO: transfer with fees


})