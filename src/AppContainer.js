import App from './App'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"
import { connectToWeb3, updateAppState } from './store/app.reducer'
import { listenOnIpcChannel, checkElectron } from './modules/electron/reducers/electron.reducer'

// Redux
const mapStateToProps = (store) => {
    return {
        app: store.app
    }
}
const mapDispatchToProps = {
    connectToWeb3,
    updateAppState,
    listenOnIpcChannel,
    checkElectron,
}

// Graphql
export const localNodeQuery = gql(`
    query {
        state,
        node {
            id, 
            ethAddress,
            publicAddress
        }
    }
`)

export default compose(
    graphql(localNodeQuery, {
        name: 'query',
        options: {
            notifyOnNetworkStatusChange: true,
            pollInterval: 2500,  // periodically ping for node state change
            errorPolicy: 'all',
        }
    }),
    connect(mapStateToProps, mapDispatchToProps),
)(App);