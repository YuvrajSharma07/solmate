import React from "react"
// import { useWallet } from "@solana/wallet-adapter-react"

// ant designs imports
import { Button, Popover } from "antd"
import { SettingOutlined } from "@ant-design/icons"

import { Settings } from "../Settings"
import { LABELS } from "../../constants"

export const AppBar = (props: { left?: JSX.Element; right?: JSX.Element }) => {
  // const { connected } = useWallet();
  const TopBar = (
    <div className="App-Bar-right">
      <div style={{ margin: 5 }} />
      {/* {connected ? <WalletDisconnectButton type="ghost" /> : null} */}
      <Button>Invite your partner!</Button>
      <Popover
        placement="topRight"
        title={LABELS.SETTINGS_TOOLTIP}
        content={<Settings />}
        trigger="click"
      >
        <Button
          shape="circle"
          size="large"
          type="text"
          icon={<SettingOutlined />}
        />
      </Popover>
      {props.right}
    </div>
  );

  return TopBar;
};
