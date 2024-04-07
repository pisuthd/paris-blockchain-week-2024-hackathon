
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import React, { useCallback } from 'react';
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, getOrCreateAssociatedTokenAccount } from '@solana/spl-token'
import BigNumber from "bignumber.js";
import * as SPLToken from "@solana/spl-token";

const useSilverSurfer = () => {

    const { connection } = useConnection();
    const { publicKey, signTransaction, sendTransaction } = useWallet();

    // send SOL to random address
    const test = useCallback(async () => {


        if (!publicKey) throw new WalletNotConnectedError();

        // 890880 lamports as of 2022-09-01
        const lamports = await connection.getMinimumBalanceForRentExemption(0);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: Keypair.generate().publicKey,
                lamports,
            })
        );

        const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();

        const signature = await sendTransaction(transaction, connection, { minContextSlot });

        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });

    }, [publicKey, sendTransaction, connection])


    const mint = useCallback(async () => {

        if (!publicKey) throw new WalletNotConnectedError();

        const mint = new PublicKey('581cZHJk44ysyMreY99aB3qZxHybw3sKaxaFGW67NdvR')

        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            publicKey,
            mint,
            publicKey,
            signTransaction
        );

        // const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        //     connection,
        //     publicKey,
        //     mint,
        //     publicKey,
        //     signTransaction
        // )

        // console.log("fromTokenAccount : ", fromTokenAccount)

        // const transaction = new Transaction().add(
        //     createMintToInstruction(
        //         mint,
        //         publicKey, // dest
        //         "J7iem2bu5qG9QL4fdZDZdfFvRZni6UQQoebVQBK7FgmV",
        //         1 * LAMPORTS_PER_SOL,
        //         [],
        //         TOKEN_PROGRAM_ID
        //     )
        // )

        // const blockHash = await connection.getRecentBlockhash()
        // transaction.feePayer = await publicKey
        // transaction.recentBlockhash = await blockHash.blockhash
        // const signed = await signTransaction(transaction)

        // await connection.sendRawTransaction(signed.serialize())

    }, [publicKey, sendTransaction, connection, signTransaction])

    const getTokenAccounts = useCallback(async (publicKey) => {

        const tokenAccounts = await connection.getTokenAccountsByOwner(
            publicKey, { programId: TOKEN_PROGRAM_ID }
        );
        const token2022Accounts = await connection.getTokenAccountsByOwner(
            publicKey, { programId: TOKEN_2022_PROGRAM_ID }
        );

        let tokens = {}

        tokenAccounts.value.forEach((e) => {
            const accountInfo = SPLToken.AccountLayout.decode(e.account.data);
            const { amount } = accountInfo
            tokens["usdc"] = amount
        });

        token2022Accounts.value.forEach((e) => {
            const accountInfo = SPLToken.AccountLayout.decode(e.account.data);
            const { amount } = accountInfo
            tokens["usds"] = amount
        });

        return tokens

    }, [connection])

    return {
        getTokenAccounts,
        test,
        mint
    }
}

export default useSilverSurfer