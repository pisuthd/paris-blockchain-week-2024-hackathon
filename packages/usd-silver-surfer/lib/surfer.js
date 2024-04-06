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
    createInitializeTransferFeeConfigInstruction,
    mintTo,
    createAssociatedTokenAccountIdempotent,
    createInitializeInterestBearingMintInstruction
} = require('@solana/spl-token')

const {
    createInitializeInstruction,
    pack,
    createUpdateFieldInstruction,
    createRemoveKeyInstruction,
} = require('@solana/spl-token-metadata')

const DECIMALS = 9

const HOST_URL = "http://localhost:8899"

// the main function to deploy the USD Silver Surfer coin

exports.deployToken = async ({
    connection,
    payer,
    mint, // minter public key
    tokenName,
    tokenSymbol,
    tokenUri,
    tokenRate = 32767, // use max value for testing
    // feeBasisPoints = 50, // 0.5%
    // maxFee = 5000,
    additionalMetadata = [['asset-type', 'silver'], ['country', "South Africa"], ["weight", "10 troy ounces"], ["purity",".999"]]
}) => {

    const transferFeeConfigAuthority = Keypair.generate();
    const withdrawWithheldAuthority = Keypair.generate();

    const feeBasisPoints = 10; // 0.1%
    const maxFee = BigInt(5_000);
 
    const rateAuthority = Keypair.generate();

    const metadata = {
        mint,
        name: tokenName,
        symbol: tokenSymbol,
        uri: tokenUri,
        additionalMetadata
    }

    const mintLen = getMintLen([ExtensionType.TransferFeeConfig, ExtensionType.MetadataPointer, ExtensionType.InterestBearingConfig])
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

    const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen)

    // Instruction to invoke System Program to create new account
    const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: payer.publicKey, // Account that will transfer lamports to created account
        newAccountPubkey: mint, // Address of the account to create
        space: mintLen, // Amount of bytes to allocate to the created account
        lamports : mintLamports, // Amount of lamports transferred to created account
        programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
    });

    // Instruction to initialize the InterestBearingConfig Extension
    const initializeInterestBearingMintInstruction =
        createInitializeInterestBearingMintInstruction(
            mint, // Mint Account address
            rateAuthority.publicKey, // Designated Rate Authority
            tokenRate, // Interest rate basis points
            TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
        );

    const initializeMintInstruction = createInitializeMintInstruction(
        mint, // Mint Account Address
        DECIMALS, // Decimals of Mint
        payer.publicKey, // Designated Mint Authority
        null, // Optional Freeze Authority
        TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
    );

    const mintTransaction = new Transaction().add(
        createAccountInstruction,
        createInitializeMetadataPointerInstruction(
            mint,
            payer.publicKey,
            mint,
            TOKEN_2022_PROGRAM_ID
        ),
        initializeInterestBearingMintInstruction,
        createInitializeTransferFeeConfigInstruction(
            mint,
            transferFeeConfigAuthority.publicKey,
            withdrawWithheldAuthority.publicKey,
            feeBasisPoints,
            maxFee,
            TOKEN_2022_PROGRAM_ID
        ), 
        initializeMintInstruction,
        createInitializeInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            mint,
            metadata: mint,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            mintAuthority: payer.publicKey, // not sure if it's suppose to be mint
            updateAuthority: payer.publicKey, // not sure if it's suppose to be mint
        }),
        createUpdateFieldInstruction({
            metadata: mint,
            updateAuthority: payer.publicKey,
            programId: TOKEN_2022_PROGRAM_ID,
            field: metadata.additionalMetadata[0][0],
            value: metadata.additionalMetadata[0][1],
        }),
        createUpdateFieldInstruction({
            metadata: mint,
            updateAuthority: payer.publicKey,
            programId: TOKEN_2022_PROGRAM_ID,
            field: metadata.additionalMetadata[1][0],
            value: metadata.additionalMetadata[1][1],
        }),
        createUpdateFieldInstruction({
            metadata: mint,
            updateAuthority: payer.publicKey,
            programId: TOKEN_2022_PROGRAM_ID,
            field: metadata.additionalMetadata[2][0],
            value: metadata.additionalMetadata[2][1],
        }),
        createUpdateFieldInstruction({
            metadata: mint,
            updateAuthority: payer.publicKey,
            programId: TOKEN_2022_PROGRAM_ID,
            field: metadata.additionalMetadata[3][0],
            value: metadata.additionalMetadata[3][1],
        }),
    );

    return mintTransaction
}

exports.getAirdrop = async (connection, account) => {

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