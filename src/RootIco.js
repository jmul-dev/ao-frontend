/**
 * RootIco is simply a wrapper around the ico page so that we 
 * can render it as a seperate standalone file. Just needed to 
 * add in the logic for web3/contracts setup.
 */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { darkTheme } from './theme';
import CssBaseline from '@material-ui/core/CssBaseline';
import IcoView from './views/ico/IcoView';

import { connectToWeb3, updateAppState, APP_STATES } from './store/app.reducer';
import { connect } from 'react-redux';
import Web3 from 'web3';


export default class IcoRoot extends Component {    
    render() {
        return (
            <Provider store={this.props.store}>
                <MuiThemeProvider theme={darkTheme}>
                    <CssBaseline>
                        <IcoAppContainer />
                    </CssBaseline>
                </MuiThemeProvider>
            </Provider>
        )
    }
}

class IcoApp extends Component {
    componentDidMount() {
        const { app, connectToWeb3, updateAppState } = this.props
        if ( typeof window.web3 !== 'undefined' ) {
            window.web3 = new Web3(window.web3.currentProvider)
            updateAppState(APP_STATES.WEB3_AVAILABLE, true)
            if ( window.web3.isConnected() ) {
                window.web3.version.getNetwork((error, networkId) => {
                    connectToWeb3(networkId)
                })
            } else {
                console.warn(`web3 was injected, but checking web3.isConnected() returned false`)
            }
        }
    }
    render() {
        return (
            <IcoView />
        )
    }
}

// Redux
const mapStateToProps = (store) => {
    return {
        app: store.app,
    }
}
const mapDispatchToProps = {
    connectToWeb3,
    updateAppState,
}

const IcoAppContainer = connect(mapStateToProps, mapDispatchToProps)(IcoApp)