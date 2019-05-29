import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Web3Provider, { Connectors } from 'web3-react'
import MyThemeProvider from './context/MyThemeProvider'
import AppProvider from './context/AppContext'

const PROVIDER_URL = "https://mainnet.infura.io/v3/df7685dd6a3e4606bd92679a358f0ef4"

const { NetworkOnlyConnector } = Connectors
const Network = new NetworkOnlyConnector({
  providerURL: PROVIDER_URL
})

const connectors = { Network }

ReactDOM.render(
  <MyThemeProvider>
    <AppProvider>
      <Web3Provider connectors={connectors} libraryName={'ethers.js'}>
        <App />
      </Web3Provider>
    </AppProvider>
  </MyThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
