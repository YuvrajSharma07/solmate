import React, {
} from 'react'

import {
	Connection,
	PublicKey,
} from '@solana/web3.js'

const defaultAuthContextState = {
    address: null,
    mintAddress: null,
    tokenAccount: null,
    numberOfTokens: 0,
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
            return false
			// alert("Phantom wallet is not installed. Please install.")
			// window.open("https://phantom.app/", "_target");
		}
	}

	getMyInfo = async () => {
		const conn = this.getConnection()
		const result = await conn.getParsedTokenAccountsByOwner(getPublicKey(), {programId: TOKEN_PROGRAM_ID}, 'processed')
		return result
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