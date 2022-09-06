import React, {useContext, useEffect, useRef, useState} from "react";
import texts from './localization'
import LocaleContext from "../../LocaleContext";
import {localized} from "../../utils/localized";
import Button from "../Button";
import MetamaskJazzicon from "../MetamaskJazzicon";
import {HidingText} from "../HidingText";
import {useWeb3React} from "@web3-react/core";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import './index.scss'
import {injected, switchNetwork, walletconnect} from "../../wallet";
import Swoosh from '../../images/NegativeBorderRadiusRight'
import WalletConnectorBubbleContext from "../../WalletConnectorBubbleContext";
import NotificationContext from "../../utils/NotificationContext";
import DisconnectWallletIcon from '../../icons/notificationIcon/index'
import button from "../Button";
import WarningCircle from '../../icons/WarningCircle';
import PersonalData from '../../icons/PersonalData';

export type HeaderButton = ((props: { onClick: () => void;}) => JSX.Element)
// CONSTANTS

// DEFAULT FUNCTIONS

// TODO: copy this components directory and add your content to make your page

type WalletConnectorPropType = {
  // You should declare props like this, delete this if you don't need props
  buttons: HeaderButton[]
}

const WalletConnectorDefaultProps = {
  // You should declare default props like this, delete this if you don't need props
}

const WalletConnector = (props: WalletConnectorPropType) => {
  const {locale} = useContext(LocaleContext)
  const {bubbleValue} = useContext(WalletConnectorBubbleContext)
  const notificationContext = useContext(NotificationContext)
  const {chainId, account, deactivate, activate, active, connector, error} = useWeb3React();
  const ref = useRef(null);
  const {buttons} = props

  const [isConnectorOpen, setIsConnectorOpen] = useState(false)
  const [isCopyShowing, setIsCopyShowing] = useState(false)

  useOnClickOutside(ref, () => setIsConnectorOpen(false))

  function mainButtonClick() {
    setIsConnectorOpen(!isConnectorOpen)
    if (56 !== chainId) {
      alert("To continue please switch your network to BSC")
    }
  }

  function disconect() {
    setIsConnectorOpen(!isConnectorOpen)
    // @ts-ignore
    if (connector && connector.walletConnectProvider) {
      deactivate();
    } else {
      notificationContext.displayNotification(
        localized(texts.metamaskWalletDisconnectNotificationTitle, locale),
        localized(texts.metamaskWalletDisconnectNotificationSubtitle, locale),
        <DisconnectWallletIcon/>
      )
    }
    setIsConnectorOpen(false)
  }

  function truncate(str: string) {
    return str.length > 0
      ? str.substr(0, 8) + "..." + str.substr(str.length - 8, str.length - 1)
      : str;
  }


  useEffect(() => {
    const initNetwork = async () => {
      if (56 !== chainId) {
        await switchNetwork();
      }
    };
    initNetwork();
  }, [active, chainId, error]);

  async function copyTextToClipboard(text: string) {
    setIsCopyShowing(true)
    setTimeout(() => {
      setIsCopyShowing(false)
    }, 1500)
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const onClickConnectorButton = () => {
    setIsConnectorOpen(false)
  }

  return (
    <div className={'disconnect-button-container'} ref={ref}>
      <div className={`notification-bubble ${(!active || bubbleValue.length === 0) ? 'hiding' : ''}`}>
        {bubbleValue.replace("EMPTY", " ")}
      </div>
      <div
        style={{zIndex: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}
      >
        {/* @ts-ignore */}
        <Button
          className={`wallet-button ${(active) ? 'connected' : 'not-connected'} 
                    ${isConnectorOpen ? 'open' : ''}`} onClick={mainButtonClick}
        >
          {active &&
            <>
              <MetamaskJazzicon/>
              <span className={`connect-title ${isConnectorOpen ? 'open' : ''}`} style={{height: 30}}>{localized(texts.profile, locale)}</span>
            </>
          }
          {!active &&
            <span
              className={`connect-title ${isConnectorOpen ? 'open' : ''}`}>{localized(texts.connectWallet, locale)}</span>
          }
          <div className={`swoosh ${isConnectorOpen ? 'open' : ''}`}>
            <Swoosh/>
          </div>
        </Button>
        {active &&
          <div
            className={`connect-wallet-flex ${isConnectorOpen ? 'open' : ''} ${(active) ? 'connected' : 'not-connected'} `}>
            <div className={`connector-options ${isConnectorOpen ? 'open' : ''}`}>
              <button
                className={`connection-button`}
                onClick={() => {
                  copyTextToClipboard(`${account}`)
                }}
              >
                <div style={{marginRight: 16}}/>
                <div style={{marginRight: 12}}/>
                <HidingText defaultText={truncate(`${account}`)} hidingText={`${localized(texts.copied, locale)}!`}
                            peekOut={isCopyShowing}/>
              </button>
              <button
                className={`connection-button`}
                style={{paddingLeft: 0, paddingRight: 0}}
                onClick={() => {
                  window.open('https://kyc-7pb.pages.dev/', '_blank')
                  setIsConnectorOpen(false)
                }}
              >
                <div className={'bordered'}>
                  <WarningCircle />
                  <div style={{marginRight: 12}}/>
                  {localized(texts.verifyPersonalData, locale)}
                  <div style={{marginRight: 12}}/>
                </div>
              </button>
              {buttons.map((item, index) => {
                  const Component = item
                  return (
                    <Component key={index} onClick={onClickConnectorButton}/>
                  )
                })
              }
              <button
                className="connection-button"
                // style={{color: 'red', fontWeight: 'bold'}}
                onClick={disconect}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="14" height="14" rx="7" stroke="white" strokeWidth="2"/>
                  <rect x="2" y="3.41431" width="2" height="15" transform="rotate(-45 2 3.41431)" fill="white"/>
                </svg>
                <div style={{marginRight: 12}}/>
                {localized(texts.disconnectWallet, locale)}
              </button>
            </div>
          </div>
        }
        {!active &&
          <div className={'connect-wallet-flex'}>
            <div className={`connector-options ${isConnectorOpen ? 'open' : ''}`}>
              <div
                className={`connection-button`}
                onClick={() => {
                  activate(injected);
                }}
              >
                <img
                  src="/images/wallet/metamask.svg"
                  alt="metamask"
                  width="30"
                  height="30"
                  style={{marginRight: 10}}
                />
                <p>MetaMask</p>
              </div>
              <div
                className={`connection-button`}
                onClick={() => {
                  activate(walletconnect).then(() => {
                     window.location.reload()
                  });
                }}
              >
                <img
                  src="/images/wallet/trustwallet.svg"
                  alt="metamask"
                  width="30"
                  height="30"
                  style={{marginRight: 10}}
                />
                <p>Wallet connect</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
};

WalletConnector.defaultProps = WalletConnectorDefaultProps

export default WalletConnector