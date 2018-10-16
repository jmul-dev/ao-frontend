// @flow
import React, { Component, Node } from 'react';
import MainLayout from './layouts/main/MainLayout';
import BootLayout from './layouts/boot/BootLayout';
import DevelopmentBarContainer from './modules/devbar/containers/DevelopmentBarContainer';
import RegisterContainer from './modules/registration/containers/RegisterContainer';
import { APP_STATES } from './store/app.reducer';
import Notifications from './modules/notifications/components/Notifications';
import Web3 from 'web3';
import './app-variables.css';
import './app.css';


type Props = {
    children: Node,
    query: {
        loading: boolean,
        error?: string,
        state?: string,
        node?: {
            id: string
        },
        networkStatus: number,
    },
    // redux connected state
    app: Object,
    isElectron: boolean,
    // redux connected actions
    updateAppState: Function,
    connectToWeb3: Function,
    listenOnIpcChannel: Function,
    checkElectron: Function,
    addNotification: Function,
    dismissNotification: Function,
};

export default class App extends Component<Props> {
    props: Props;
    _networkDisconnectedErrorNotificationId = null;
    constructor() {
        super()
        this.state = {
            didCatch: false,
            didCatchError: undefined,
        }
    }
    componentDidCatch(error, info) {
        this.setState({didCatch: true, didCatchError: error})
        if ( this.props.isElectron ) {
            window.chrome.ipcRenderer.send('ERRORS_REACT', {error, info});
        }
        // dispatch react error

    }
    componentDidMount() {
        const { app, connectToWeb3, listenOnIpcChannel, checkElectron, updateAppState } = this.props
        checkElectron()
        listenOnIpcChannel()
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
    componentWillReceiveProps( nextProps: Props ) {
        const { app, query, updateAppState } = this.props
        if ( !query.state && nextProps.query.state !== undefined ) {
            // no core state -> core state, means our core connection has been established
            updateAppState(APP_STATES.CORE_CONNECTED, true)
        }
        if ( query.networkStatus === 8 && nextProps.query.networkStatus < 8 ) {
            // couldnt connect to core -> now connected to core
            updateAppState(APP_STATES.CORE_CONNECTED, true)
            if ( this._networkDisconnectedErrorNotificationId ) {
                this.props.dismissNotification(this._networkDisconnectedErrorNotificationId)
            }
        } else if ( query.networkStatus < 8 && nextProps.query.networkStatus === 8 ) {
            // network error just occured, ie couldnt connect to core
            updateAppState(APP_STATES.CORE_CONNECTED, false)
            if ( app.states[APP_STATES.CORE_CONNECTED] ) {
                this._networkDisconnectedErrorNotificationId = this.props.addNotification({
                    message: `Disconnected from ao-core. You may need to restart the application.`,
                    variant: 'error',
                })
            }
        }
        if ( query.state !== 'READY' && nextProps.query.state === 'READY' ) {  // TODO: pull READY from ao-core constants
            setTimeout(() => {
                updateAppState(APP_STATES.CORE_READY, true)
            }, 500)  // slight delay to avoid flashing of screens (see BootLayout.js timeout)
        }
    }
    render() {
        const { query, app, isElectron } = this.props
        const includeDevBar = false // process.env.NODE_ENV !== 'production'
        return (
            <div className={`App ${includeDevBar ? 'development-bar-spacing' : ''}`}>                
                {app.states[APP_STATES.CORE_READY] ? (
                    <React.Fragment>
                        <MainLayout />
                        <RegisterContainer />
                    </React.Fragment>
                ) : (
                    <BootLayout networkError={query.error} />
                )}
                <Notifications />
                {includeDevBar ? (
                    <DevelopmentBarContainer />
                ):null}
            </div>
        );
    }
}
