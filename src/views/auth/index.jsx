// import { WalletMultiButton } from "@solana/wallet-adapter-ant-design";
import { 
  Button, 
  Col, 
  Row,
  Card,
} from "antd";
import React, { 
  // useEffect,
  useContext,
} from "react";
import { InviteView } from "..";
// import { useConnectionConfig } from "../../contexts/connection";
// import { useMarkets } from "../../contexts/market";
import {HomePageIcon} from '../../components/AnimatedLogo'
import { AuthContext } from "../../contexts";
// import TorusAuth from "../../components/TorusAuth";

export const AuthView = () => {
  // const { marketEmitter, midPriceInUSD } = useMarkets();
  // const { tokenMap } = useConnectionConfig();
  
  const authCon = useContext(AuthContext)

  // useEffect(() => {
  //   const refreshTotal = () => {};

  //   const dispose = marketEmitter.onMarket(() => {
  //     refreshTotal();
  //   });

  //   refreshTotal();

  //   return () => {
  //     dispose();
  //   };
  // }, [marketEmitter, midPriceInUSD, tokenMap]);

  if (!authCon.address) {
    return (
      <Row align="middle">
        <Col md={16} span={24}>
          <HomePageIcon />
        </Col>
        <Col md={8} span={24}>
          <div className="site-card-border-less-wrapper">
            <Card title="Card title" bordered={false}>
              {/* <TorusAuth /> */}
              <Button onClick={() => (authCon.handleConnectWallet())}>Login with Phantom</Button>
              <hr />
              {/* <WalletMultiButton type="ghost" /> */}
            </Card>
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <>
      <InviteView />
    </>
  )

};
