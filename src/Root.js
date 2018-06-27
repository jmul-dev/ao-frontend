// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import AppContainer from './AppContainer';
import { ApolloProvider } from "react-apollo";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import aoTheme from './theme';
import './index.css'

const theme = createMuiTheme(aoTheme)

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
                        <MuiThemeProvider theme={theme}>
                            <AppContainer />
                        </MuiThemeProvider>
                    </ConnectedRouter>
                </Provider>
            </ApolloProvider>
        );
    }
}
