import React, {
  useContext,
} from "react"
// import { useWallet } from "@solana/wallet-adapter-react"

// ant designs imports
import { Button, Popover } from "antd"
import { SettingOutlined } from "@ant-design/icons"

// import { Settings } from "../Settings"
import { LABELS } from "../../constants"
import { AuthContext } from "../../contexts";



export const AppBar = ({ left, right, ...props }) => {
  // const { connected } = useWallet();
  const authCon = useContext(AuthContext)
  const TopBar = (
    <div className="App-Bar-right">
      <div style={{ margin: 5 }} />
      {/* {connected ? <WalletDisconnectButton type="ghost" /> : null} */}
      <Button onClick={!authCon.address ? () => authCon.handleConnectWallet() : ''}>Invite your partner!</Button>
      <Popover
        placement="topRight"
        title={LABELS.SETTINGS_TOOLTIP}
        // content={<Settings />}
        trigger="click"
      >
        <Button
          shape="circle"
          size="large"
          type="text"
          icon={<SettingOutlined />}
        />
      </Popover>
      {right}
    </div>
  );

  return TopBar;
};
