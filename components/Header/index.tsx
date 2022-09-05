import React, {useEffect, useState} from "react";
import Button from "../Button.js";
import ConnectModal from "../ConnectModal";
import {useWeb3React} from "@web3-react/core";
import './index.css'
// @ts-ignore
import {HidingText} from "../HidingText";
import logo from '../../images/MMProLogo.svg'
import logoSmall from '../../images/MMProLogoSmall.svg'
import arrowUp from '../../images/arrowUpWhite.svg'
import {LocaleSelector} from "../LocaleSelector";
import MetamaskJazzicon from "../MetamaskJazzicon";
import {Link, useHistory} from "react-router-dom";
import WalletConnector, {HeaderButton} from "../WalletConnector";
import {localized} from "../../utils/localized";
import texts from "../WalletConnector/localization";

const HeaderDefaultProps = {
  logoHref: 'https://marketmaking.pro/'
}

const Header = (props: { headerButtons?: React.ReactElement[], connectorButtons: HeaderButton[], logoHref?: string, hideWalletConnector?: boolean, locales: string[], pages?: { title: string, url: string }[] }) => {
  const {locales, pages, logoHref, hideWalletConnector, headerButtons, connectorButtons} = props
  const [selectedPage, setSelectedPage] = useState(pages ? pages[0].url : '')
  const history = useHistory()

  useEffect(() => {
    setSelectedPage(window.location.pathname)
  }, [])

  return (
    <>
      <header className="px-4 mx-auto py-4" style={{minWidth: 340, zIndex: 5}}>
        <div className="flex flex-row justify-between items-center w-full">
          <div className={'logo-and-tabs'}>
            <a href={logoHref}>
              <img
                src={logo}
                width="180"
                className="cursor-pointer logo-large"
                alt="mmpro logo"
              />
              <img
                src={logoSmall}
                width="180"
                className="cursor-pointer logo-small"
                alt="mmpro logo"
              />
            </a>
            <div className={'separator'}/>
            <div className={'tabs'}>
              {(pages !== undefined && pages.length > 0) &&
              <>
                {pages.map(page => (
                  <Link
                    className={`page-tab ${selectedPage === page.url && 'tab-selected'}`}
                    onClick={() => {
                      setSelectedPage(page.url)
                    }}
                    to={page.url}
                  >
                    {page.title}
                    <div className={'tab-selector'}/>
                  </Link>
                ))}
              </>
              }
            </div>
          </div>

          <div className={'control-strip'}>
            {headerButtons &&
              headerButtons.map(button => button)
            }
            {locales.length > 1 &&
            <LocaleSelector locales={locales}/>
            }
            {!hideWalletConnector &&
            <WalletConnector buttons={connectorButtons}/>
            }
          </div>
        </div>
      </header>
    </>
  );
};

Header.defaultProps = HeaderDefaultProps

export default Header