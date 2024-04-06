const { createMint, getMint, getOrCreateAssociatedTokenAccount, mintTo, getAccount } = require('@solana/spl-token')
const { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js')
const { HOST_URL } = require("./utils")

const chai = require('chai');

const { expect } = chai


describe('#fungible_token', function () {

    let payer
    let mintAuthority
    let freezeAuthority

    let mint

    let connection
    let tokenAccount

    before(async () => {

        payer = Keypair.generate();
        mintAuthority = Keypair.generate();
        freezeAuthority = Keypair.generate();

        connection = new Connection(HOST_URL);
    });

    it('Getting SOL tokens success', async () => {

        const airdropSignature = await connection.requestAirdrop(
            payer.publicKey,
            LAMPORTS_PER_SOL,
        );

        await connection.confirmTransaction(airdropSignature);

        expect(1000000000).to.equal(LAMPORTS_PER_SOL)

        const balance = await connection.getBalance(payer.publicKey)
        expect(balance).to.equal(LAMPORTS_PER_SOL)

    })

    it('Creating your own fungible token', async () => {

        mint = await createMint(
            connection,
            payer,
            mintAuthority.publicKey,
            freezeAuthority.publicKey,
            9 // We are using 9 to match the CLI decimal default exactly
        );

        const mintInfo = await getMint(
            connection,
            mint
        )

        expect(mintInfo.supply).to.equal(0n)

        tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mint,
            payer.publicKey
        )

    })

    it('Minting 100 TOKENS', async () => {
   
        await mintTo(
            connection,
            payer,
            mint,
            tokenAccount.address,
            mintAuthority,
            100000000000 // because decimals for the mint are set to 9 
          )

          const mintInfo = await getMint(
            connection,
            mint
          )
          
          expect(mintInfo.supply).to.equal(100000000000n)
          // 100
          
          const tokenAccountInfo = await getAccount(
            connection,
            tokenAccount.address
          )
          
          expect(tokenAccountInfo.amount).to.equal(100000000000n)
    })

    // TODO: transfer, burn

})