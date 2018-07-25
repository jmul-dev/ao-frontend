import App from './App'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"
import { connectToWeb3, updateAppState } from './store/app.reducer'
import { listenOnIpcChannel } from './modules/electron/reducers/electron.reducer'

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
}

// Graphql
export const localNodeQuery = gql(`
    query {
        state,
        node {
            id, ethAddress
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