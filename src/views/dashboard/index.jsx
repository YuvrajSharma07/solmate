import React, {
    useContext
} from 'react'

import {
	// Connection,
	PublicKey,
	Keypair,
	LAMPORTS_PER_SOL,
	SystemProgram,
	// TransactionInstruction,
	// SYSVAR_RENT_PUBKEY,
	Transaction
} from '@solana/web3.js'

import {
	// ASSOCIATED_TOKEN_PROGRAM_ID,
	MintLayout,
	// AccountLayout,
	Token,
	TOKEN_PROGRAM_ID,
	// u64
} from '@solana/spl-token'

// import {
//     Buffer
// } from 'buffer'

import bs58 from 'bs58'
// import * as BufferLayout from 'buffer-layout'
import { AuthContext } from '../../contexts'


const DashboardView = ({match, ...props}) => {
	
	const urlParams = match.params

	const {userURLData} = urlParams

	const urlDataArr = window.atob(userURLData).split(' ')

	const senderPubkey = urlDataArr[0]

    const {
        getConnection,
        getPublicKey,
        getRecentBlockhash,
        setMintAddress,
    } = useContext(AuthContext)

    const createTokens = async () => {

		let connection = getConnection()

		// create new Account
		const mintAccount = new Keypair()

		try {

			const createAccIx = SystemProgram.createAccount({
				fromPubkey: getPublicKey(),
				newAccountPubkey: mintAccount.publicKey,
				lamports: LAMPORTS_PER_SOL,
				space: MintLayout.span,
				programId: TOKEN_PROGRAM_ID,
			})

			// console.log(createAccIx)

			// create mint init instruction
			const createMintIx = Token.createInitMintInstruction(
				TOKEN_PROGRAM_ID,
				mintAccount.publicKey,
				1,
				getPublicKey(),
				getPublicKey() ? getPublicKey() : null
			)
			// console.log(createMintIx)

			// Construct the transaction
			let tx = new Transaction().add(createAccIx, createMintIx)

			// Signature of the fee payer
			tx.feePayer = getPublicKey()


			tx.recentBlockhash = (await getRecentBlockhash()).blockhash

			// console.log("Signatures done after this")

			tx.sign(mintAccount)

			const signedTransaction = await window.solana.request({
				method: "signTransaction",
				params: {
					message: bs58.encode(tx.serializeMessage()),
				},
			})
			// const signedTransaction = await window.solana.signTransaction(tx.serializeMessage());
			// console.log(signedTransaction)

			const signature = bs58.decode(signedTransaction.signature)
			const publicKey = new PublicKey(signedTransaction.publicKey)
			tx.addSignature(publicKey, signature)

			setMintAddress(mintAccount.publicKey.toBase58())

			let si = await connection.sendRawTransaction(tx.serialize())
			const hash = await connection.confirmTransaction(si)

			// console.log(hash);

		} catch (e) {
			setMintAddress(null)
			alert(e.message)
			console.log(e, e.message)
		}
	}

    return (
        <>

        </>
    )
}

export default DashboardView