import App from "./App";
import { connect } from "react-redux";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import {
    connectToWeb3,
    updateAppState,
    setCoreEthNetworkId
} from "./store/app.reducer";
import {
    listenOnIpcChannel,
    checkElectron
} from "./modules/electron/reducers/electron.reducer";
import {
    addNotification,
    dismissNotification
} from "./modules/notifications/reducers/notifications.reducer";

// Redux
const mapStateToProps = store => {
    return {
        app: store.app,
        isElectron: store.electron.isElectron
    };
};
const mapDispatchToProps = {
    connectToWeb3,
    updateAppState,
    listenOnIpcChannel,
    checkElectron,
    addNotification,
    dismissNotification,
    setCoreEthNetworkId
};

// Graphql
export const localNodeQuery = gql(`
    query {
        state,
        node {
            id, 
            ethAddress,
            publicKey,
            publicAddress,
        }
        statistics {
            ethNetworkId
        }
    }
`);

export default compose(
    graphql(localNodeQuery, {
        name: "query",
        options: {
            notifyOnNetworkStatusChange: true,
            pollInterval: 2500, // periodically ping for node state change
            errorPolicy: "all"
        }
    }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(App);
