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
    createInitializeMetadataPointerInstruction,
    createInitializeMintInstruction,
    ExtensionType,
    getMintLen,
    getMint,
    getMetadataPointerState,
    getTokenMetadata,
    LENGTH_SIZE,
    TOKEN_2022_PROGRAM_ID,
    createInterestBearingMint,
    TYPE_SIZE,
    mintTo,
    createAssociatedTokenAccountIdempotent
} = require('@solana/spl-token')

const {
    createInitializeInstruction,
    pack,
    createUpdateFieldInstruction,
    createRemoveKeyInstruction,
} = require('@solana/spl-token-metadata')

const chai = require('chai');
const { expect } = chai


const { getAirdrop, HOST_URL } = require("./utils")

const DECIMALS = 9;

const RATE = 10

describe('#interest-bearing', function () {

    let payer
    let mintAuthority
    let freezeAuthority
    let rateAuthority
    let mintKeypair

    let mint

    before(async () => {

        payer = Keypair.generate()
        mintAuthority = Keypair.generate();
        freezeAuthority = Keypair.generate();
        rateAuthority = Keypair.generate();
        mintKeypair = Keypair.generate();

        connection = new Connection(HOST_URL)
    })

    it('Creating interest bearing tokens success', async () => {

        await getAirdrop(connection, payer)

        mint = await createInterestBearingMint(
            connection,
            payer,
            mintAuthority.publicKey,
            freezeAuthority.publicKey,
            rateAuthority.publicKey,
            RATE,
            DECIMALS,
            mintKeypair,
            undefined,
            TOKEN_2022_PROGRAM_ID
        );

    })

    it('Minting tokens success', async () => {

        const sourceAccount = await createAssociatedTokenAccountIdempotent(connection, payer, mintAuthority.publicKey, payer.publicKey, {}, TOKEN_2022_PROGRAM_ID)

        await mintTo(
            connection,
            payer,
            mintAuthority.publicKey,
            sourceAccount,
            payer.publicKey,
            10000000,
            [],
            undefined,
            TOKEN_2022_PROGRAM_ID
        )
            
    })


})