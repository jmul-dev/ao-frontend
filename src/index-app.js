import React from 'react';
import { render } from 'react-dom';
import { AppContainer as HotLoaderContainer } from 'react-hot-loader';
import Root from './Root';
import { configureStore, history } from './store/configureStore';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client/lib/main';


window.AO_CORE_URL = process.env.NODE_ENV === 'production' ? 'http://localhost:6579' : 'http://localhost:3003'

const store = configureStore();

const client = new ApolloClient({
    link: createUploadLink({
        uri: `${window.AO_CORE_URL}/graphql`
    }),
    cache: new InMemoryCache({
        dataIdFromObject: (object) => {
            // We are differentiating between user content and network content, avoid sharing cache 
            // (should have possibly been different graphql types, but saving that for another time)
            if ( object.__typename === 'VideoContent' && object.isNetworkContent ) {
                return `network:${object.id}`
            }
            return defaultDataIdFromObject(object)
        }
    }),
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
