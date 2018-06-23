// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import AppContainer from './AppContainer';
import { ApolloProvider } from "react-apollo";


type Props = {
    store: {},
    history: {},
    client: {},
};

export default class Root extends Component<Props> {
    render() {
        return (
            <ApolloProvider client={this.props.client}>            
                <Provider store={this.props.store}>
                    <ConnectedRouter history={this.props.history}>
                        <AppContainer />
                    </ConnectedRouter>
                </Provider>
            </ApolloProvider>
        );
    }
}
