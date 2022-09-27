import React, {useContext, useState} from "react";
import button from "../../Standard/components/Button";
import {HidingText} from "../../Standard/components/HidingText";
import {localized} from "../../Standard/utils/localized";
import texts from "./localization";
import {useWeb3React} from "@web3-react/core";
import LocaleContext from "../../Standard/LocaleContext";

const WalletButton = () => {

  const {locale} = useContext(LocaleContext)

  const {account} = useWeb3React()
  const [isCopyShowing, setIsCopyShowing] = useState(false)

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

  function truncate(str: string) {
    return str.length > 0
      ? str.substr(0, 8) + "..." + str.substr(str.length - 8, str.length - 1)
      : str;
  }

  return (
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
  )
}

export default WalletButton;