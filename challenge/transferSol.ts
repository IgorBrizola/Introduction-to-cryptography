require("dotenv").config()

import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { clusterApiUrl, Connection, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";

const secretKey = getKeypairFromEnvironment("SECRET_KEY")

const suppliedToPublickey = process.argv[2] || null

if (!suppliedToPublickey){
    console.error("Please provide the public key")
    process.exit(1)
}

const isValidKey = (publicKey: string): [boolean, PublicKey] => {
    try{
        const toPublicKey = new PublicKey(publicKey)
        const valid = PublicKey.isOnCurve(publicKey)
        return [valid, toPublicKey]
    } catch (error) {
        return [valid, error]; 
    }
} 

const [valid, publicKey] = isValidKey(suppliedToPublickey)

if (valid && publicKey){
    console.log(`✅✅✅ PublicKey valid - ${publicKey.toBase58()} ✅✅✅`)
    try{

        const connection = new Connection(clusterApiUrl("devnet"))

        const transaction = new Transaction()

        const quantitySolana = 1000000000

        const sendSolInstruction = SystemProgram.transfer({
            fromPubkey: secretKey.publicKey,
            toPubkey: publicKey,
            lamports: quantitySolana
        })

        transaction.add(sendSolInstruction)

        const signature = await sendAndConfirmTransaction(connection, transaction, [
            secretKey
        ])
        
        console.log(
            `Transaction success you can view your transaction on Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`,
        );
    } catch(error){
        console.error(error, "Failed Transaction!")
    }
} else {
    console.error(`❌❌❌ Invalid public key - ${publicKey} ❌❌❌`)
}

