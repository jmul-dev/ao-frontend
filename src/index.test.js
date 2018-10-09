import React from 'react';
import { render } from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client/lib/main';
import { configureStore, history } from './store/configureStore';

const store = configureStore();

const client = new ApolloClient({
    link: createUploadLink({
        uri: `http://localhost:3003/graphql`
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

class Dummy extends React.Component {
    _sendToElectron(message) {
        window.chrome.ipcRenderer.send(message);
    }
    render() {
        const isElectron = !!window.chrome.ipcRenderer
        const isWeb3 = !!window.web3
        const { client, history, store } = this.props
        return (
            <div>
                <div>Is Electron: {isElectron ? 'yes' : 'no'}</div>
                <div>Have web3: {isWeb3 ? 'yes' : 'no'}</div>
                <div>Have client: {client ? 'yes' : 'no'}</div>
                <div>Have history: {history ? 'yes' : 'no'}</div>
                <div>Have store: {store ? 'yes' : 'no'}</div>
                {isWeb3 && (
                    <div>
                        <button onClick={this._sendToElectron.bind(this, 'open-metamask-popup')}>{'open-metamask-popup'}</button>
                    </div>
                )}
            </div>
        )
    }
}

render(
    <Dummy client={client} store={store} history={history} />,
    document.getElementById('root')
);