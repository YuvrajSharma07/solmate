// React and Solana SDK imports

import React, { 
  // useMemo 
} from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
// import { WalletProvider } from "@solana/wallet-adapter-react"
// import {
//   getLedgerWallet,
//   getMathWallet,
//   getPhantomWallet,
//   getSolflareWallet,
//   getSolletWallet,
//   getSolongWallet,
//   // getTorusWallet,
// } from "@solana/wallet-adapter-wallets"

// Contexts
// import { ConnectionProvider } from "./contexts/connection"
// import { AccountsProvider } from "./contexts/accounts"
// import { MarketProvider } from "./contexts/market"

// Components
import { AppLayout } from "./components/Layout"

// Views
import { FaucetView, AuthView, DashboardView } from "./views"
import {LABELS} from './constants'
import { AuthContextProvider } from "./contexts"
// import TorusAuth from "./components/TorusAuth"
export function Routes() {
  // const wallets = useMemo(
  //   () => [
  //     getPhantomWallet(),
  //     getSolflareWallet(),
  //     // getTorusWallet({
  //     //   options: {
  //     //     // TODO: Get your own tor.us wallet client Id
  //     //     clientId:
  //     //       "BOM5Cl7PXgE9Ylq1Z1tqzhpydY0RVr8k90QQ85N7AKI5QGSrr9iDC-3rvmy0K_hF0JfpLMiXoDhta68JwcxS1LQ",
  //     //   },
  //     // }),
  //     getLedgerWallet(),
  //     getSolongWallet(),
  //     getMathWallet(),
  //     getSolletWallet(),
  //   ],
  //   []
  // );

  return (
    <Router basename={"/"}>
      <AuthContextProvider>
      {/* <ConnectionProvider>
        <WalletProvider wallets={wallets} autoConnect>
          <AccountsProvider>
            <MarketProvider> */}
              <AppLayout>
                <Switch>
                  <Route exact path="/" component={AuthView} />
                  <Route exact path="/invite/:userURLData" component={DashboardView} />
                  {LABELS.ISDEV && <Route exact path="/faucet" children={<FaucetView />} />}
                </Switch>
              </AppLayout>
            {/* </MarketProvider>
          </AccountsProvider>
        </WalletProvider>
      </ConnectionProvider> */}
      </AuthContextProvider>
    </Router>
  );
}
