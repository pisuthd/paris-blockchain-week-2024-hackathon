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

describe('#metadata', function () {

    let payer
    let minter

    before(async () => {

        payer = Keypair.generate()
        minter = Keypair.generate()

        connection = new Connection(HOST_URL)

    })

    it('Setting up metadata success', async () => {

        await getAirdrop(connection, payer)

        const metadata = {
            mint: minter.publicKey,
            name: 'TOKEN_NAME',
            symbol: 'SMBL',
            uri: 'URI',
            additionalMetadata: [['new-field', 'new-value']],
        };

        const mintLen = getMintLen([ExtensionType.MetadataPointer])
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

        const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen)

        const mintTransaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: payer.publicKey,
                newAccountPubkey: minter.publicKey,
                space: mintLen,
                lamports: mintLamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMetadataPointerInstruction(
                minter.publicKey,
                payer.publicKey,
                minter.publicKey,
                TOKEN_2022_PROGRAM_ID
            ),
            createInitializeMintInstruction(minter.publicKey, DECIMALS, payer.publicKey, null, TOKEN_2022_PROGRAM_ID),
            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                mint: minter.publicKey,
                metadata: minter.publicKey,
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadata.uri,
                mintAuthority: payer.publicKey,
                updateAuthority: payer.publicKey,
            }),

            // add a custom field
            createUpdateFieldInstruction({
                metadata: minter.publicKey,
                updateAuthority: payer.publicKey,
                programId: TOKEN_2022_PROGRAM_ID,
                field: metadata.additionalMetadata[0][0],
                value: metadata.additionalMetadata[0][1],
            }),

            // update a field
            createUpdateFieldInstruction({
                metadata: minter.publicKey,
                updateAuthority: payer.publicKey,
                programId: TOKEN_2022_PROGRAM_ID,
                field: 'name',
                value: 'YourToken',
            }),

            // remove a field
            createRemoveKeyInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                metadata: minter.publicKey,
                updateAuthority: payer.publicKey,
                key: 'new-field',
                idempotent: true, // If false the operation will fail if the field does not exist in the metadata
            })
        );
        const sig = await sendAndConfirmTransaction(connection, mintTransaction, [payer, minter]);
        console.log('Signature:', sig);
    })

    it('Reading metadata success', async () => {

        // Retrieve mint information
        const mintInfo = await getMint(
            connection,
            minter.publicKey,
            "confirmed",
            TOKEN_2022_PROGRAM_ID,
        );

        // Retrieve and log the metadata pointer state
        const metadataPointer = getMetadataPointerState(mintInfo);
        console.log("\nMetadata Pointer:", JSON.stringify(metadataPointer, null, 2));

        // Retrieve and log the metadata state
        const metadata = await getTokenMetadata(
            connection,
            minter.publicKey, // Mint Account address
        );
        console.log("\nMetadata:", JSON.stringify(metadata, null, 2));

    })

    it('Minting tokens /w metadata success', async () => {

        const sourceAccount = await createAssociatedTokenAccountIdempotent(connection, payer, minter.publicKey, payer.publicKey, {}, TOKEN_2022_PROGRAM_ID)

        await mintTo(
            connection,
            payer,
            minter.publicKey,
            sourceAccount,
            payer.publicKey,
            1000000,
            [],
            undefined,
            TOKEN_2022_PROGRAM_ID
        )

    })

})