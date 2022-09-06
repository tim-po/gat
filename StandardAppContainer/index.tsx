/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, {ReactNode, useEffect, useState} from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {useConnectionCheck} from "../hooks/useConnectionCheck";
import {injected} from "../wallet";
import {useWeb3React} from "@web3-react/core";
import {useLocale} from "../hooks/useLocale";
import LocaleContext from "../LocaleContext";
import NotificationContext from "../utils/NotificationContext";
import "./index.css";
import "../styles.scss";
import {ConfigProvider} from "antd";
import WalletConnectorBubbleContext from "Standard/WalletConnectorBubbleContext";
import styled from "styled-components";
import {HeaderButton} from "../components/WalletConnector";

const defaultProps = {
  locales: ["en"]
};

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  margin-bottom: 10px;
`

const StandardAppContainer = (props: { headerButtons?: React.ReactElement[], logoHref?: string, connectorButtons: HeaderButton[], hideWalletConnector?: boolean, children: any, locales: string[], isDarkBG?: boolean, version: string, pages?: { title: string, url: string }[] }) => {
  const {locales, isDarkBG, version, pages, logoHref, hideWalletConnector, connectorButtons, headerButtons} = props;

  let forcedLocale;
  if (locales.length === 1) {
    forcedLocale = locales[0];
  }
  // @ts-ignore
  const {active, activate, networkError} = useWeb3React();
  const {setLocale, locale} = useLocale(forcedLocale);
  const [shouldDisplayNotification, setShouldDisplayNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('')
  const [notificationSubtitle, setNotificationSubtitle] = useState('')
  const [notificationIcon, setNotificationIcon] = useState<ReactNode>(null)

  useConnectionCheck();

  const [bubbleValue, setBubbleValue] = useState('');

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized && !active && !networkError) {
        activate(injected);
      }
    });
  }, [activate, networkError]);

  const displayNotification = (title: string, subtitle: string, icon: ReactNode) => {
    setNotificationIcon(icon)
    setNotificationTitle(title)
    setNotificationSubtitle(subtitle)
    setShouldDisplayNotification(true);
    setTimeout(() => {
      setShouldDisplayNotification(false);
    }, 2500);
  };

  return (
    // @ts-ignore
    <ConfigProvider getPopupContainer={trigger => trigger.parentElement}>
      <LocaleContext.Provider value={{setLocale, locale}}>
        <WalletConnectorBubbleContext.Provider value={{
          setBubbleValue: setBubbleValue,
          bubbleValue: bubbleValue,
        }}>
          <NotificationContext.Provider
            value={{
              displayNotification
            }}
          >
            <div className={`main-content-container ${isDarkBG ? "main-gradient" : "main-gradient-light"}`}>
              <div className={`notification ${shouldDisplayNotification ? "shown" : ""}`}>
                <TitleWrapper>
                  {notificationIcon}
                  <div className={"notification-title"}>
                    {notificationTitle}
                  </div>
                </TitleWrapper>
                <div className={"notification-body"}>
                  {notificationSubtitle}
                </div>
              </div>
              <Header
                connectorButtons={connectorButtons}
                logoHref={logoHref}
                hideWalletConnector={hideWalletConnector}
                pages={pages}
                locales={locales}
                headerButtons={headerButtons}
              />
              <div className={"children-container"}>
                {props.children}
                <Footer version={version}/>
              </div>
            </div>
          </NotificationContext.Provider>
        </WalletConnectorBubbleContext.Provider>
      </LocaleContext.Provider>
    </ConfigProvider>
  );
};

StandardAppContainer.defaultProps = defaultProps;

export default StandardAppContainer;
