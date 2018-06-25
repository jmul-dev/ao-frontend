import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './Root';
import { configureStore, history } from './store/configureStore';
import ApolloClient from "apollo-boost";
import Web3 from 'web3';

window.IS_ELECTRON = window.chrome && window.chrome.ipcRenderer

// TODO: Setup web3
if ( typeof window.web3 !== 'undefined' ) {
    window.web3 = new Web3(window.web3.currentProvider)
}

const store = configureStore({
    app: {
        web3Available: typeof window.web3 !== 'undefined'
    }
});

const client = new ApolloClient({
    uri: 'http://localhost:3003/graphql'  // TODO: pull this from env or config
})

render(
    <AppContainer>
        <Root store={store} history={history} client={client} />
    </AppContainer>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept('./Root', () => {
        const NextRoot = require('./Root'); // eslint-disable-line global-require
        render(
            <AppContainer>
                <NextRoot store={store} history={history} client={client} />
            </AppContainer>,
            document.getElementById('root')
        );
    });
}
