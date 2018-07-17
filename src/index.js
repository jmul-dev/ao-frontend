import React from 'react';
import { render } from '../../../Library/Caches/typescript/2.9/node_modules/@types/react-dom';
import { AppContainer as HotLoaderContainer } from 'react-hot-loader';
import Root from './Root';
import { configureStore, history } from './store/configureStore';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client/lib/main';
import Web3 from '../../../Library/Caches/typescript/2.9/node_modules/@types/web3';


if ( typeof window.web3 !== 'undefined' ) {
    window.web3 = new Web3(window.web3.currentProvider)
}

const store = configureStore({
    app: {
        web3Available: typeof window.web3 !== 'undefined'
    }
});

const client = new ApolloClient({
    link: createUploadLink({
        uri: 'http://localhost:3003/graphql' // TODO: pull this from env or config
    }),
    cache: new InMemoryCache(),
})

render(
    <HotLoaderContainer>
        <Root store={store} history={history} client={client} />
    </HotLoaderContainer>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept('./Root', () => {
        const NextRoot = require('./Root'); // eslint-disable-line global-require
        render(
            <HotLoaderContainer>
                <NextRoot store={store} history={history} client={client} />
            </HotLoaderContainer>,
            document.getElementById('root')
        );
    });
}
