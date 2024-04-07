import {
    Connection,
    Keypair,
    sendAndConfirmTransaction,
    clusterApiUrl,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Transaction,
    PublicKey,
  } from "@solana/web3.js";
  
  import {
    createInitializeMetadataPointerInstruction,
    createInitializeMintInstruction,
    ExtensionType,
    getMintLen,
    getMint,
    getMetadataPointerState,
    createAccount,
    getTokenMetadata,
    LENGTH_SIZE,
    TOKEN_2022_PROGRAM_ID,
    TYPE_SIZE,
    createInitializeTransferFeeConfigInstruction,
    mintTo,
    createAssociatedTokenAccountIdempotent,
    createInitializeInterestBearingMintInstruction,
    getOrCreateAssociatedTokenAccount,
  } from "@solana/spl-token";
  
  import {
    createInitializeInstruction,
    pack,
    createUpdateFieldInstruction,
    createRemoveKeyInstruction,
  } from "@solana/spl-token-metadata";
  
  const DECIMALS = 9;
  
  describe("#mint script", function () {
    let payer;
    let minter;
  
    let mint;
  
    let connection;
  
    before(async () => {
      payer = pg.wallet.keypair;
      minter = Keypair.generate();
  
      mint = new PublicKey("581cZHJk44ysyMreY99aB3qZxHybw3sKaxaFGW67NdvR"); // USD
  
      connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    });
  
    it("Minting coin success", async () => {
      const mintAmount = BigInt(1_000_000_000); // amount to mint
      const recipient = new PublicKey(
        "7WnwzsgcZBauRpteE1vYVxqXo7Yn65FfHKicrRg2KLbc" // recipient 
      );
  
      const sourceAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        recipient,
        false,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
      );
  
      await mintTo(
        connection,
        payer,
        mint,
        sourceAccount.address,
        payer.publicKey,
        mintAmount,
        [],
        undefined,
        TOKEN_2022_PROGRAM_ID
      );
      console.log("mint address : ", mint);
    });
  });
  