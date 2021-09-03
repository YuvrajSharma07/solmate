import React, {
    useContext,
    useState,
    useEffect,
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
import { Button, Col, Input, Row } from 'antd'
import { notify } from '../../utils/notifications'


const InviteView = () => {

    const {
        getConnection,
        getPublicKey,
    } = useContext(AuthContext)
    
    const publicKey = getPublicKey()

    const [inputVal, setInputVal] = useState('')

    const copyLink = () => {
        navigator.clipboard.writeText(inputVal)
        notify({
            message: 'Link copied!'
        })
    }

    useEffect(() => {
        setInputVal(new String(`${window.location.origin}/invite/${window.btoa(publicKey)}`))
    }, [])

    return (
        <>
        <Row>
            <Col>
            <div>
                <div>
                    Send proposal to your solmate.
                    <div>
                        <Input 
                            value={inputVal} 
                            bordered={false} 
                            addonAfter={<Button type="text" onClick={copyLink}>Copy link</Button>} 
                            readOnly 
                        />
                    </div>
                </div>
            </div>
            </Col>
        </Row>
        </>
    )
}

export default InviteView