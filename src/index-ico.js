import React from 'react';
import { render } from 'react-dom';
import { AppContainer as HotLoaderContainer } from 'react-hot-loader';
import RootIco from './RootIco';
import { configureStore, history } from './store/configureStore';
import { ApolloClient } from "apollo-client";
import {
    InMemoryCache,
    IntrospectionFragmentMatcher,
    defaultDataIdFromObject
} from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";

const store = configureStore();

// NOTE: types should really be generated from the graphql interface
// https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher
const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
        __schema: {
            types: ["VideoContent", "DappContent", "PdfContent"]
        }
    }
});

const client = new ApolloClient({
    link: createUploadLink({
        uri: `${process.env.REACT_APP_AO_CORE_URL}/graphql`
    }),
    cache: new InMemoryCache({
        fragmentMatcher,
        dataIdFromObject: object => {
            // We are differentiating between user content and network content, avoid sharing cache
            // (should have possibly been different graphql types, but saving that for another time)
            if (object.isNetworkContent) {
                return `${object.__typename}:network:${object.id}`;
            }
            return defaultDataIdFromObject(object);
        }
    })
});

export const getApolloClient = () => client;

render(
    <HotLoaderContainer>
        <RootIco store={store} history={history} client={client} />
    </HotLoaderContainer>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept('./RootIco', () => {
        const NextRoot = require('./RootIco'); // eslint-disable-line global-require
        render(
            <HotLoaderContainer>
                <NextRoot store={store} history={history} client={client} />
            </HotLoaderContainer>,
            document.getElementById('root')
        );
    });
}
