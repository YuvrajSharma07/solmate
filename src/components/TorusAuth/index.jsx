import React, { useEffect, useState } from "react";
import OpenLogin from "openlogin";
import AccountInfo  from "./AccountInfo";
// import { Account, Connection } from "@solana/web3.js";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import {ENDPOINTS, useConnection} from '../../contexts/connection'
// import * as bs58 from "bs58";
import { Button } from "antd";


function Login() {
  const solanaNetwork = ENDPOINTS[2]
  const connection = useConnection()

  const [loading, setLoading] = useState(false);
  const [openlogin, setSdk] = useState(undefined);
  const [torusNetwork, setTorusNetwork] = useState(null)
  
  useEffect(() => {
    setLoading(true);
    async function initializeOpenlogin() {
      const sdkInstance = new OpenLogin({
        clientId: "BKhXC_4iQTUS2YYxh791vs-zFsytY9nuRGmyvWIgLLPnBMWiAfSdiEonx-OXdeXEXvIkWiR9AqBBKijpg5vRawE",
        network: "testnet"//localStorage.getItem('network') || 'testnet',
      });
      try {
      await sdkInstance.init();
      } catch (e) {
        console.log('error on init', e)
      }

      if (sdkInstance.privKey) {
        // const userInfo = await sdkInstance.getUserInfo()
        // console.log('user info', userInfo)

        const privateKey = sdkInstance.privKey;
        const secretKey = getSolanaPrivateKey(privateKey);
        // await getAccountInfo(secretKey);
      }
      setSdk(sdkInstance);
      setLoading(false);
    }
    initializeOpenlogin();
  }, [torusNetwork]);


  const getSolanaPrivateKey = (openloginKey)=>{
    const  { sk } = getED25519Key(openloginKey);
    return sk;
  }

  // const getAccountInfo = async(secretKey) => {
  //   const account = new Account(secretKey);
  //   const accountInfo = await connection.getAccountInfo(account.publicKey);
  //   return accountInfo;
  // }

  async function handleLogin() {
    setLoading(true)
    try {
      const privKey = await openlogin.login({
        redirectUrl: `${window.origin}`,
        relogin: false
      });
      if(privKey && typeof privKey === "string") {
        // const userInfo = await openlogin.getUserInfo()
        // console.log('user info', userInfo)
        const solanaPrivateKey = getSolanaPrivateKey(privKey);
        // await getAccountInfo(solanaNetwork.url, solanaPrivateKey);
      } 
    
      setLoading(false)
    } catch (error) {
      console.log("error", error);
      setLoading(false)
    }
  }

  const handleLogout = async (fastLogin=false) => {
    setLoading(true)
    await openlogin.logout({
       fastLogin
    });
    setLoading(false)
  }
  
  return (
    <>
    {loading ?
      <div>
          <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", margin: 20 }}>
              <h1>....loading</h1>
          </div>
      </div> 
    :
      <div>
        {(openlogin && openlogin.privKey) ?
          <AccountInfo
            handleLogout={handleLogout}
            loading={loading}
            // privKey={solanaPrivateKey}
            // walletInfo={walletInfo}
            // account={account}
          /> 
        :
          <div className="loginContainer">
              <Button onClick={handleLogin} className="btn">
                Login using Torus
              </Button>
          </div>
        }

      </div>
    }
    </>
  );
}

export default Login;
