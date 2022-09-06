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
import {useHistory} from "react-router-dom";
import Swoosh from '../../images/NegativeBorderRadiusRight'
import WalletConnectorBubbleContext from "../../WalletConnectorBubbleContext";
import NotificationContext from "../../utils/NotificationContext";
import DisconnectWallletIcon from '../../icons/notificationIcon/index'
import button from "../Button";

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
  const {bubbleValue, setAccentedControlButton, accentedControlButton} = useContext(WalletConnectorBubbleContext)
  const notificationContext = useContext(NotificationContext)
  const {chainId, account, deactivate, activate, active, connector, error} = useWeb3React();
  const ref = useRef(null);
  const {buttons} = props

  const [isConnectorOpen, setIsConnectorOpen] = useState(false)
  const [isCopyShowing, setIsCopyShowing] = useState(false)
  const [visualWaletFix, setVisualWaletFix] = useState(false)
  const history = useHistory()

  useOnClickOutside(ref, () => setIsConnectorOpen(false))

  function mainButtonClick() {
    setIsConnectorOpen(!isConnectorOpen)
    if (56 !== chainId) {
      alert("To continue please switch your network to BSC")
    }
  }

  // useEffect(()=>{
  //     setTimeout(()=>{
  //         setVisualWaletFix(false)
  //     }, 1000)
  // }, [])

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
          className={`wallet-button ${(active || visualWaletFix) ? 'connected' : 'not-connected'} 
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
            className={`connect-wallet-flex ${isConnectorOpen ? 'open' : ''} ${(active || visualWaletFix) ? 'connected' : 'not-connected'} `}>
            <div className={`connector-options ${isConnectorOpen ? 'open' : ''}`}>
              <button
                className={`connection-button ${accentedControlButton === 0 ? 'accented' : ''}`}
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
                className={`connection-button ${accentedControlButton === 1 ? 'accented' : ''}`}
                style={{paddingLeft: 0, paddingRight: 0}}
                // onClick={() => {
                //   window.open('https://kyc-7pb.pages.dev/', '_blank')
                //   setIsConnectorOpen(false)
                // }}
              >
                <div className={'bordered'}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="8" fill="#FFB627"/>
                    <path
                      d="M9 5.54595L8.53479 9.75561C8.50498 10.0253 8.27708 10.2294 8.00574 10.2294V10.2294C7.73496 10.2294 7.50733 10.0261 7.47686 9.75703L7 5.54595V4C7 3.44772 7.44772 3 8 3V3C8.55228 3 9 3.44772 9 4V5.54595ZM7.99681 11.0327C8.52262 11.0327 8.94888 11.4589 8.94888 11.9848V12.0479C8.94888 12.5737 8.52262 13 7.99681 13V13C7.47099 13 7.04473 12.5737 7.04473 12.0479V11.9848C7.04473 11.4589 7.47099 11.0327 7.99681 11.0327V11.0327Z"
                      fill="white"/>
                  </svg>
                  <div style={{marginRight: 12}}/>
                  {localized(texts.verifyPersonalData, locale)}
                  <div style={{marginRight: 12}}/>
                  {/*<svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                  {/*  <path*/}
                  {/*    d="M18.7071 8.70711C19.0976 8.31658 19.0976 7.68342 18.7071 7.29289L12.3431 0.928932C11.9526 0.538408 11.3195 0.538408 10.9289 0.928932C10.5384 1.31946 10.5384 1.95262 10.9289 2.34315L16.5858 8L10.9289 13.6569C10.5384 14.0474 10.5384 14.6805 10.9289 15.0711C11.3195 15.4616 11.9526 15.4616 12.3431 15.0711L18.7071 8.70711ZM0 9L18 9V7L0 7L0 9Z"*/}
                  {/*    fill="white"/>*/}
                  {/*</svg>*/}
                </div>
              </button>
              {buttons.map((item) => {
                  const Component = item
                  return (
                    <Component onClick={onClickConnectorButton}/>
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
                className={`connection-button ${accentedControlButton === 3 ? 'accented' : ''}`}
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
                className={`connection-button ${accentedControlButton === 4 ? 'accented' : ''}`}
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