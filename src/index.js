import "./styles/tailwind.css";
import "./styles/index.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import App from "./App";
import { getLibrary } from "./Standard/wallet";
import * as Sentry from "@sentry/react";
import {BrowserTracing} from "@sentry/tracing";
import BigNumber from "bignumber.js";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
const rootElement = document.getElementById("root");

Sentry.init({
  dsn: "https://e60d9e5c00ea4889abc898f4550066e1@o1410955.ingest.sentry.io/6748735",
  integrations: [new BrowserTracing()],

  environment: window.location.href.includes("localhost") ? 'dev': 'production',
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

BigNumber.config({ EXPONENTIAL_AT: 40 })


ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </BrowserRouter>,
  rootElement
);
