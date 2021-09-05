import React, {
useContext,
useEffect,
useState,
} from 'react'


import { 
	Button, Col, Row, 
  } from "antd"

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
	AccountLayout,
	Token,
	TOKEN_PROGRAM_ID,
	// u64
} from '@solana/spl-token'

import heartIcon from '../../components/AnimatedLogo/solana.svg'

// import {
//     Buffer
// } from 'buffer'

import bs58 from 'bs58'
// import * as BufferLayout from 'buffer-layout'
import { AuthContext } from '../../contexts'
import { notify } from '../../utils/notifications'

import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'


const DashboardView = ({match, ...props}) => {
	const {width, height} = useWindowSize()
	const urlParams = match.params

	const {userURLData} = urlParams

	const urlDataArr = window.atob(userURLData).split(' ')

	const senderPubkey = urlDataArr[0]

	const senderName = urlDataArr[1]

    const {
		address,
		handleConnectWallet,
		getRecentBlockhash,
        setMintAddress,
        mintAddress,
        tokenAccount,
		getPublicKey,
        // createTokenAccount,
		setTokenAccount,
		getConnection,
		setSenderTokenAccount,
		senderTokenAccount,
		getMyInfo,
		married,
		setMarried,
    } = useContext(AuthContext)

	const createTokens = async () => {

		const connection = getConnection()

		// create new Account
		const mintAccount = new Keypair()

        const expectedMintBalance = await Token.getMinBalanceRentForExemptMint(connection)

		try {

			const createAccIx = SystemProgram.createAccount({
				fromPubkey: getPublicKey(),
				newAccountPubkey: mintAccount.publicKey,
				lamports: expectedMintBalance,
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
			notify({
				message: e.message
			})
			// alert(e.message)
			// console.log(e, e.message)
		}
	}

    const checkBalance = async () => {
        const conn = getConnection()
		const userBalance = (await conn.getBalance(getPublicKey())) // / LAMPORTS_PER_SOL


        const expectedAccBalance = await Token.getMinBalanceRentForExemptAccount(conn)
        const expectedMintBalance = await Token.getMinBalanceRentForExemptMint(conn)

        const minBalance = (expectedAccBalance + expectedMintBalance)

        if (userBalance >= minBalance) {
			notify({
				message: 'Please approve the following transactions to continue with the marriage.'
			})
            createTokens()
        } else {
            notify({
                message: 'Not enough tokens in wallet.',
                description: `Please add more coins to your wallet to proceed. You are around ${userBalance - minBalance} SOLs short.`
            })
        }
    }

	const createTokenAccount = async (pubkey) => {
		const tokenMintPubkey = new PublicKey(`${mintAddress}`)
		const ownerPubkey = pubkey ? new PublicKey(pubkey) : getPublicKey()

		const connection = getConnection()

		const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(connection)

		const newAccount = new Keypair()

		const createAccIx = SystemProgram.createAccount({
			fromPubkey: ownerPubkey,
			newAccountPubkey: newAccount.publicKey,
			lamports: balanceNeeded,
			space: AccountLayout.span,
			programId: TOKEN_PROGRAM_ID
		});

		const createTokenAccountIx = Token.createInitAccountInstruction(
			TOKEN_PROGRAM_ID,
			tokenMintPubkey,
			newAccount.publicKey,
			ownerPubkey
		);

		let tx = new Transaction().add(createAccIx, createTokenAccountIx);

		tx.feePayer = ownerPubkey;

		tx.recentBlockhash = (await getRecentBlockhash()).blockhash;

		tx.sign(newAccount);

		const signedTransaction = await window.solana.request({
			method: "signTransaction",
			params: {
				message: bs58.encode(tx.serializeMessage()),
			},
		});
		// console.log(signedTransaction);

		const signature = bs58.decode(signedTransaction.signature);
		const publicKey = new PublicKey(signedTransaction.publicKey);
		tx.addSignature(publicKey, signature);

		let si = await connection.sendRawTransaction(tx.serialize());
		const hash = await connection.confirmTransaction(si);

		console.log(hash);

		if (pubkey) {
			setSenderTokenAccount(newAccount.publicKey.toBase58())
		} else {
			setTokenAccount(newAccount.publicKey.toBase58())
		}
	}

	useEffect(() => {
        if (mintAddress && !tokenAccount && !senderTokenAccount) {
            createTokenAccount()
        }
    }, [mintAddress])

	useEffect(() => {
		if(tokenAccount && !senderTokenAccount) {
			createTokenAccount(senderPubkey)
		}
	}, [tokenAccount])

	useEffect(() => {
		if (senderTokenAccount) {
			const myInfo = async () => {
				const result = await getMyInfo()
				console.log(result)
			}
			myInfo()

			setMarried(true)
			// notify({
			// 	message: `I now pronounce you SolMates with ${senderPubkey}`
			// })
		}
	}, [senderTokenAccount])
    

    return (
        <>
		{married ?
			<Confetti 
				width={width}
				height={height}
			/>
		: 
			<></>
		}
		<Row align="center" justify="center" style={{height: height}}>
			<Col md={12} span={24} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
				<div>
					{married ? 
						<>
						<div>
							<h1 style={{fontSize: '4rem', color: '#CD097F'}} className="zoomin">Congratulations!</h1>
							<h2 style={{fontSize: '2rem'}} className="zoomin-5">You are now officially married <br />with your one and only SolMate, <span style={{color: '#CD097F'}}>{senderName}</span></h2>
						</div>
						</>
					:
						<>
						<Col md={12} span={24} style={{margin: '0 auto'}}>
							<img src={heartIcon} style={{height: 'auto', width: '100%'}} />
						</Col>
						<h1>{senderName} has proposed to marry you!</h1>
						{address ? 
							<Button 
								size="large" 
								type="primary" 
								onClick={checkBalance.bind(this)}
							>
								Make them your SolMate
							</Button>
						:
							<Button onClick={handleConnectWallet}>Login via Phantom</Button>
						}
						</>
					}
				</div>
			</Col>
		</Row>
        </>
    )
}

export default DashboardView