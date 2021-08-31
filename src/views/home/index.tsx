import { WalletMultiButton } from "@solana/wallet-adapter-ant-design";
import { 
  // Button, 
  Col, 
  Row,
  Card,
} from "antd";
import React, { 
  // useEffect
} from "react";
// import { useConnectionConfig } from "../../contexts/connection";
// import { useMarkets } from "../../contexts/market";
import {HomePageIcon} from '../../components/AnimatedLogo'
import TorusAuth from "../../components/TorusAuth";

export const HomeView = () => {
  // const { marketEmitter, midPriceInUSD } = useMarkets();
  // const { tokenMap } = useConnectionConfig();
  

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

  return (
    <Row align="middle">
      <Col md={16} span={24}>
        <HomePageIcon />
      </Col>
      <Col md={8} span={24}>
        <div className="site-card-border-less-wrapper">
          <Card title="Card title" bordered={false}>
            <TorusAuth />
            {/* <Button>Login with Torus</Button> */}
            <hr />
            <WalletMultiButton type="ghost" />
          </Card>
        </div>
      </Col>
    </Row>
  );
};
