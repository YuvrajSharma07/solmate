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
        // getConnection,
        getPublicKey,
    } = useContext(AuthContext)
    
    const publicKey = getPublicKey()

    const [username, setUsername] = useState('SomeoneSpecial')

    const urlData = `${publicKey} ${username}`

    const [inputVal, setInputVal] = useState((String(`${window.location.origin}/invite/${window.btoa(urlData)}`)))

    console.log(urlData)

    const copyLink = () => {
        navigator.clipboard.writeText(inputVal)
        notify({
            message: 'Link copied!'
        })
    }

    const handleInput = (char) => {
        setUsername(char.replace(' ', ''))
    }

    return (
        <>
        <Row align="center" justify="center">
            <Col style={{alignItems: 'center', display: 'flex'}}>
            <div>
                <div>
                    <h1>Send proposal to your solmate. </h1>
                    <div>
                        <h3>Enter your name or a unique keyword so that your partner knows it's you.</h3>
                        <small>Avoid use of spaces in the name</small>
                        <Input 
                            value={username} 
                            onChange={(e) => {handleInput(e.target.value)}} 
                            onBlur={() => setInputVal(String(`${window.location.origin}/invite/${window.btoa(urlData)}`))}
                        />
                    </div>
                    <hr style={{border: '0.5px solid #eee'}} />
                    <div>
                        <Input 
                            value={inputVal} 
                            bordered={false} 
                            addonAfter={<Button type="ghost" onClick={copyLink}>Copy link</Button>} 
                            readOnly 
                        />
                        {/* {(mintAddress && tokenAccount) ? 
                        :
                            <div>
                                <Button onClick={checkBalance.bind(this)} type="primary" size="large">
                                    Send proposal your partner
                                </Button>
                            </div>
                        } */}
                    </div>
                </div>
            </div>
            </Col>
        </Row>
        </>
    )
}

export default InviteView