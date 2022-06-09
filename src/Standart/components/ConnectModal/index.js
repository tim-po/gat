/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Modal from "../Modal";
import './index.css'
import { useWeb3React } from "@web3-react/core";
import { injected, walletconnect, switchNetwork } from "../../wallet";

export default function ConnectModal(props) {
  const { chainId, activate, active, error } = useWeb3React();
  const { opened, closeHandle, setError } = props;

  useEffect(() => {
    const initNetwork = async () => {
      // setError(56 !== chainId && active);
      // if (56 !== chainId) {
      //   await switchNetwork();
      // }
    };
    initNetwork();
  }, [active, chainId, error]);

  return (
    <>
      {opened && (
        <Modal title="Connect Wallet" onClose={closeHandle}>
          <div className="flex flex-col">
            <button
              className="connection-button flex flex-row items-center m-1 p-1 rounded-md cursor-pointer"
              onClick={() => {
                activate(injected);
                closeHandle();
              }}
            >
              <img
                src="/images/wallet/metamask.svg"
                alt="metamask"
                width="50"
                height="50"
                className="mr-3"
              />
              <p className="text-black">Metamask</p>
            </button>
            <button
              className="connection-button flex flex-row items-center m-1 p-1 rounded-md cursor-pointer"
              onClick={() => {
                activate(walletconnect).then(()=>{
                  window.location.reload()
                });
                closeHandle();
              }}
            >
              <img
                src="/images/wallet/trustwallet.svg"
                alt="metamask"
                width="50"
                height="50"
                className="mr-3"
              />
              <p className="text-black">Wallet connect</p>
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
