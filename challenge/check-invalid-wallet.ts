require("dotenv").config();

import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const validateSolAddress = (address: string): [boolean, PublicKey | null] => {
    try {
        const publicKey = new PublicKey(address);
        const isSolana = PublicKey.isOnCurve(publicKey.toBuffer());
        return [isSolana, publicKey];
    } catch (error) {
        return [false, null]; 
    }
};

const [isValid, publicKey] = validateSolAddress("ADDRESS VALID OR INVALID");

if (isValid && publicKey) {
    console.log("✔ Valid Solana Address");

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    try {
        const balanceInLamports = await connection.getBalance(publicKey);

        const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

        console.log(`💰 Finished! The balance for the wallet at address ${publicKey.toBase58()} is ${balanceInSOL} SOL.`);
    } catch (error) {
        console.error("✖ Error fetching balance:", error);
    }
} else {
    console.log(`✖ Invalid Solana Address`);
}
