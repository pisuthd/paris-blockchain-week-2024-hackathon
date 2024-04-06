const {
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
} = require('@solana/web3.js')

const {
    ExtensionType,
    createInitializeMintInstruction,
    mintTo,
    createAccount,
    getMintLen,
    getTransferFeeAmount,
    unpackAccount,
    TOKEN_2022_PROGRAM_ID,
} = require('@solana/spl-token')

const {
    createInitializeTransferFeeConfigInstruction,
    harvestWithheldTokensToMint,
    transferCheckedWithFee,
    withdrawWithheldTokensFromAccounts,
    withdrawWithheldTokensFromMint,
} = require('@solana/spl-token')

const chai = require('chai');
const { expect } = chai


const { getAirdrop, HOST_URL } = require("./utils")


describe('#transfer-fee', function () {

    let payer
    let mintAuthority
    let mintKeypair
    let transferFeeConfigAuthority
    let withdrawWithheldAuthority

    let mint

    before(async () => {

        payer = Keypair.generate()
        mintAuthority = Keypair.generate();
        transferFeeConfigAuthority = Keypair.generate();
        withdrawWithheldAuthority = Keypair.generate();
        mintKeypair = Keypair.generate()

        mint = mintKeypair.publicKey

        connection = new Connection(HOST_URL)
    })

    it('Setting tokens with transfer fees success', async () => {

        await getAirdrop(connection, payer)

        const extensions = [ExtensionType.TransferFeeConfig];

        const mintLen = getMintLen(extensions);
        const decimals = 9;
        const feeBasisPoints = 50;
        const maxFee = BigInt(5_000);

        const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen);
        const mintTransaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: payer.publicKey,
                newAccountPubkey: mint,
                space: mintLen,
                lamports: mintLamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeTransferFeeConfigInstruction(
                mint,
                transferFeeConfigAuthority.publicKey,
                withdrawWithheldAuthority.publicKey,
                feeBasisPoints,
                maxFee,
                TOKEN_2022_PROGRAM_ID
            ),
            createInitializeMintInstruction(mint, decimals, mintAuthority.publicKey, null, TOKEN_2022_PROGRAM_ID)
        );
        await sendAndConfirmTransaction(connection, mintTransaction, [payer, mintKeypair], undefined)

    })

    it('Minting and transfering tokens and pay fees success', async () => {

        const decimals = 9;
        const feeBasisPoints = 50;

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
            mintAuthority,
            mintAmount,
            [],
            undefined,
            TOKEN_2022_PROGRAM_ID
        );

        const accountKeypair = Keypair.generate();
        const destinationAccount = await createAccount(
            connection,
            payer,
            mint,
            owner.publicKey,
            accountKeypair,
            undefined,
            TOKEN_2022_PROGRAM_ID
        );

        const transferAmount = BigInt(1_000_000);
        const fee = (transferAmount * BigInt(feeBasisPoints)) / BigInt(10_000);
        await transferCheckedWithFee(
            connection,
            payer,
            sourceAccount,
            mint,
            destinationAccount,
            owner,
            transferAmount,
            decimals,
            fee,
            [],
            undefined,
            TOKEN_2022_PROGRAM_ID
        );

    })


})