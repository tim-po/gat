import {useEffect, useState} from "react";
import {useWeb3React} from "@web3-react/core";
import {walletconnectNoQr} from "../wallet/connectors";

export const useConnectionCheck = () => {
  const {active, activate} = useWeb3React();

  const [shouldTryWalletConnect, setShouldTryWalletConnect] = useState(false)

  function tryWalletConnect() {
    if(!active && shouldTryWalletConnect){
      activate(walletconnectNoQr)
      setShouldTryWalletConnect(false)
    }
  }

  useEffect(() => {
    if(active && shouldTryWalletConnect){
      setShouldTryWalletConnect(false)
    } else {
      tryWalletConnect()
    }
  }, [active, shouldTryWalletConnect])

  useEffect(()=>{
    setTimeout(()=>{
      setShouldTryWalletConnect(true)
    }, 1000)
  }, [])
};