import React, {
} from 'react'

import {
	Connection,
	PublicKey,
	Keypair,
	SystemProgram,
	Transaction,

} from '@solana/web3.js'

import {
	TOKEN_PROGRAM_ID,
	Token,
	AccountLayout,
} from '@solana/spl-token'

import bs58 from 'bs58'

const defaultAuthContextState = {
    address: null,
    mintAddress: null,
    tokenAccount: null,
    numberOfTokens: 0,
	senderTokenAccount: null,
	married: false
}

const AuthContext = React.createContext(defaultAuthContextState)

class AuthContextProvider extends React.Component {
    state = {
        ...defaultAuthContextState,
    }

    getConnection = () => {
		let connection = new Connection("https://api.devnet.solana.com", "confirmed")
		return connection
	}

    getRecentBlockhash = async () => {
		let connection = this.getConnection()
		let blockhash = await connection.getRecentBlockhash("max")
		return blockhash
	}

    getPublicKey = () => {
		// Okay so I had my localnet offline and thus it was failing. Nothing to do with
		// Publickey or Keypair
		let userAddress = new PublicKey(window.solana.publicKey.toString())
		return userAddress
	}

	setMintAddress = (mintAddress) => {
		this.setState({mintAddress})
	}

    connectToWallet = async () => {
		await window.solana.connect()
	}

    handleConnectWallet = async () => {
		// Check if phantom is installed or not and prompt to install it.
		if (window.solana && window.solana.isPhantom) {
			await this.connectToWallet();

			// update address and balance of the wallet
			this.setState({address: window.solana.publicKey.toString()})
			// getDerivedAccountAddress();
			// console.log(getConnection())
            return true
		} else {
			window.open("https://phantom.app/", "_blank")
		}
	}

	getMyInfo = async () => {
		const conn = this.getConnection()
		const result = await conn.getParsedTokenAccountsByOwner(this.getPublicKey(), {programId: TOKEN_PROGRAM_ID}, 'processed')
		return result
	}

	createTokenAccount = async (mintAddress) => {
		(mintAddress && this.setState({mintAddress}))

		const tokenMintPubkey = new PublicKey(`${mintAddress ?? this.state.mintAddress}`);
		const ownerPubkey = this.getPublicKey();

		const connection = this.getConnection();

		const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(
			connection
		);

		const newAccount = new Keypair();

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

		tx.recentBlockhash = (await this.getRecentBlockhash()).blockhash;

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

		// console.log(hash);

		this.setState({tokenAccount: newAccount.publicKey.toBase58()});
	}

	setTokenAccount = (tokenAccount) => {
		this.setState({tokenAccount})
	}

	setSenderTokenAccount = (senderTokenAccount) => {
		this.setState({senderTokenAccount})
	}

	setMarried = (married) => {
		this.setState({married})
	}

    render() {
        return (
            <AuthContext.Provider value={{
                ...this.state,
                getConnection: this.getConnection,
                getRecentBlockhash: this.getRecentBlockhash,
                getPublicKey: this.getPublicKey,
				setMintAddress: this.setMintAddress,
				connectToWallet: this.connectToWallet,
				handleConnectWallet: this.handleConnectWallet,
				createTokenAccount: this.createTokenAccount,
				setTokenAccount: this.setTokenAccount,
				setSenderTokenAccount: this.setSenderTokenAccount,
				getMyInfo: this.getMyInfo,
				setMarried: this.setMarried,
            }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

export {
    AuthContextProvider,
	AuthContext,
}