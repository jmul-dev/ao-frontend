import React, { Component } from "react";
import MainLayout from "./layouts/main/MainLayout";
import BootLayout from "./layouts/boot/BootLayout";
import DevelopmentBarContainer from "./modules/devbar/containers/DevelopmentBarContainer";
import RegisterContainer from "./modules/registration/containers/RegisterContainer";
import { APP_STATES, getNetworkName } from "./store/app.reducer";
import Notifications from "./modules/notifications/components/Notifications";
import Web3 from "web3";
import { AO_CONSTANTS } from "ao-library";
import "./app-variables.css";
import "./app.css";
import PropTypes from "prop-types";
import SettingsIcon from "@material-ui/icons/Settings";

export default class App extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
        children: PropTypes.node,
        query: PropTypes.shape({
            loading: PropTypes.bool.isRequired,
            error: PropTypes.string,
            state: PropTypes.string,
            node: PropTypes.object,
            networkStatus: PropTypes.number
        }).isRequired,
        app: PropTypes.object.isRequired,
        isElectron: PropTypes.bool.isRequired,
        updateAppState: PropTypes.func.isRequired,
        connectToWeb3: PropTypes.func.isRequired,
        listenOnIpcChannel: PropTypes.func.isRequired,
        checkElectron: PropTypes.func.isRequired,
        addNotification: PropTypes.func.isRequired,
        dismissNotification: PropTypes.func.isRequired,
        setCoreEthNetworkId: PropTypes.func.isRequired
    };
    _networkDisconnectedErrorNotificationId = null;
    _networkMismatchNotificationId = null;
    constructor() {
        super();
        this.state = {
            didCatch: false,
            didCatchError: undefined
        };
    }
    componentDidCatch(error, info) {
        this.setState({ didCatch: true, didCatchError: error });
        console.error(`App::componentDidCatch`, error);
        if (this.props.isElectron) {
            window.chrome.ipcRenderer.send(AO_CONSTANTS.IPC.ERRORS_REACT, {
                error,
                info
            });
        }
    }
    componentDidMount() {
        const {
            connectToWeb3,
            listenOnIpcChannel,
            checkElectron,
            updateAppState
        } = this.props;
        checkElectron();
        listenOnIpcChannel();
        if (typeof window.web3 !== "undefined") {
            window.web3 = new Web3(window.web3.currentProvider);
            updateAppState(APP_STATES.WEB3_AVAILABLE, true);
            if (window.web3.isConnected()) {
                window.web3.version.getNetwork((error, networkId) => {
                    connectToWeb3(networkId);
                });
            } else {
                console.warn(
                    `web3 was injected, but checking web3.isConnected() returned false`
                );
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        const { app, query, updateAppState } = this.props;
        if (!query.state && nextProps.query.state !== undefined) {
            // no core state -> core state, means our core connection has been established
            updateAppState(APP_STATES.CORE_CONNECTED, true);
        }
        if (query.networkStatus === 8 && nextProps.query.networkStatus < 8) {
            // couldnt connect to core -> now connected to core
            updateAppState(APP_STATES.CORE_CONNECTED, true);
            if (this._networkDisconnectedErrorNotificationId) {
                this.props.dismissNotification(
                    this._networkDisconnectedErrorNotificationId
                );
                this._networkDisconnectedErrorNotificationId = null;
            }
        } else if (
            query.networkStatus < 8 &&
            nextProps.query.networkStatus === 8
        ) {
            // network error just occured, ie couldnt connect to core
            updateAppState(APP_STATES.CORE_CONNECTED, false);
            if (app.states[APP_STATES.CORE_CONNECTED]) {
                this._networkDisconnectedErrorNotificationId = this.props.addNotification(
                    {
                        message: `Disconnected from ao-core. You may need to restart the application.`,
                        variant: "error"
                    }
                );
            }
        }
        if (query.state !== "READY" && nextProps.query.state === "READY") {
            // TODO: pull READY from ao-library constants
            setTimeout(() => {
                updateAppState(APP_STATES.CORE_READY, true);
            }, 500); // slight delay to avoid flashing of screens (see BootLayout.js timeout)
        }
        if (
            query.statistics &&
            query.statistics.ethNetworkId !== app.coreEthNetworkId
        ) {
            this.props.setCoreEthNetworkId(query.statistics.ethNetworkId);
        }
    }
    componentDidUpdate() {
        const { app, addNotification, dismissNotification } = this.props;
        if (app.coreEthNetworkId && app.ethNetworkId) {
            if (`${app.coreEthNetworkId}` !== `${app.ethNetworkId}`) {
                const coreEthNetworkName = getNetworkName(app.coreEthNetworkId);
                this._networkMismatchNotificationId = addNotification({
                    message: `AO is currently running on the ${coreEthNetworkName}. Switch to this network (in Metamask) or update the network settings...`,
                    variant: "error",
                    hideVarientIcon: true,
                    action: () => {
                        this.context.router.history.push(`/app/view/settings`);
                    },
                    ActionIcon: SettingsIcon
                });
            } else if (this._networkMismatchNotificationId !== null) {
                dismissNotification(this._networkMismatchNotificationId);
                this._networkMismatchNotificationId = null;
            }
        }
    }
    render() {
        const { query, app } = this.props;
        const includeDevBar = false; // process.env.NODE_ENV !== 'production'
        return (
            <div
                className={`App ${
                    includeDevBar ? "development-bar-spacing" : ""
                }`}
            >
                {app.states[APP_STATES.CORE_READY] ? (
                    <React.Fragment>
                        <MainLayout />
                        <RegisterContainer />
                    </React.Fragment>
                ) : (
                    <BootLayout networkError={query.error} />
                )}
                <Notifications />
                {includeDevBar ? <DevelopmentBarContainer /> : null}
            </div>
        );
    }
}
