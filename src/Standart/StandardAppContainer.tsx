/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, {useEffect} from "react";
import Footer from "./components/Footer";
import {Header} from "./components/Header";
import {useConnectionCheck} from "./hooks/useConnectionCheck";
import {injected} from "./wallet";
import {useWeb3React} from "@web3-react/core";

const StandardAppContainer = (props: any) => {
  // @ts-ignore
  const {active, activate, networkError} = useWeb3React();
  useConnectionCheck()

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized && !active && !networkError) {
        activate(injected);
      }
    });
  }, [activate, networkError]);

  return (
    <div className="w-full overflow-hidden main-gradient"
         style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: "space-between"}}>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: "flex-start"}}>
        <Header/>
        {props.children}
      </div>
      <Footer/>
    </div>
  );
};

export default StandardAppContainer;
