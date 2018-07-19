// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import AppContainer from './AppContainer';
import { ApolloProvider } from "react-apollo";
import { MuiThemeProvider } from '@material-ui/core/styles';
import { darkTheme } from './theme';
import CssBaseline from '@material-ui/core/CssBaseline';

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
                        <MuiThemeProvider theme={darkTheme}>
                            <CssBaseline>
                                <AppContainer />
                            </CssBaseline>
                        </MuiThemeProvider>
                    </ConnectedRouter>
                </Provider>
            </ApolloProvider>
        );
    }
}
