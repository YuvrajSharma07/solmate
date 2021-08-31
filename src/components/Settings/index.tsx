import React from "react";
import {
  // WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-ant-design"
// import { useWallet } from "@solana/wallet-adapter-react";
import { Link } from "react-router-dom";
import { 
  Button, 
  Select,
} from "antd";
import { useUserBalance } from "../../hooks";
import { WRAPPED_SOL_MINT } from "../../utils/ids";
import { formatUSD } from "../../utils/utils";
import { ENDPOINTS, useConnectionConfig } from "../../contexts/connection";
import { LABELS } from "../../constants"

export const Settings = () => {
  // const { connected, disconnect } = useWallet();
  const { endpoint, setEndpoint } = useConnectionConfig();
  const SOL = useUserBalance(WRAPPED_SOL_MINT);

  return (
    <>
      <div style={{ display: "grid" }}>
        {LABELS.ISDEV ?
          <>
          Network:{" "}
          
          <Select
            onSelect={setEndpoint}
            value={endpoint}
            style={{ marginBottom: 20 }}
          >
            {ENDPOINTS.map(({ name, endpoint }) => (
              <Select.Option value={endpoint} key={endpoint}>
                {name}
              </Select.Option>
            ))}
          </Select>

          <div style={{marginBottom: '10px'}}>
            <h2>
              SOL: {SOL.balance} ({formatUSD.format(SOL.balanceInUSD)})
            </h2>
            <Link to="/faucet">
              <Button>Faucet</Button>
            </Link>
          </div>

          </>
        :
          <></>
        }
        <WalletMultiButton type="primary" />
        {/* {connected && (
          <Button type="primary" onClick={disconnect}>
            Disconnect
          </Button>
        )} */}
      </div>
    </>
  );
};
