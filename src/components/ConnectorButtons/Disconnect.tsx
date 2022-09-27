import React, {useContext} from 'react';
import {localized} from "../../Standard/utils/localized";
import texts from "./localization";
import button from "../../Standard/components/Button";
import DisconnectWalletIcon from "../../Standard/icons/notificationIcon";
import {useWeb3React} from "@web3-react/core";
import NotificationContext from "../../Standard/utils/NotificationContext";
import LocaleContext from "../../Standard/LocaleContext";

const DisconnectButton = () => {
  const {deactivate, connector} = useWeb3React()
  const notificationContext = useContext(NotificationContext)
  const {locale} = useContext(LocaleContext)

  function disconnect() {


    // @ts-ignore
    if (connector && connector.walletConnectProvider) {
      deactivate();
    } else {
      notificationContext.displayNotification(
        localized(texts.metamaskWalletDisconnectNotificationTitle, locale),
        localized(texts.metamaskWalletDisconnectNotificationSubtitle, locale),
        <DisconnectWalletIcon/>
      )
    }
  }

  return (
    <button
      className="connection-button"
      // style={{color: 'red', fontWeight: 'bold'}}
      onClick={disconnect}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="14" height="14" rx="7" stroke="currentColor" strokeWidth="2"/>
        <rect x="2" y="3.41431" width="2" height="15" transform="rotate(-45 2 3.41431)" fill="currentColor"/>
      </svg>
      <div style={{marginRight: 12}}/>
      {localized(texts.disconnectWallet, locale)}
    </button>
  );
};

export default DisconnectButton
