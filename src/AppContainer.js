import App from './App'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"
import { connectedToNetwork } from './store/app.reducer'

// Redux
const mapStateToProps = (store) => {
    return {
        app: store.app
    }
}
const mapDispatchToProps = {
    connectedToNetwork
}

// Graphql
export const localNodeQuery = gql(`
    query {
        node {
            id, ethAddress
        }
    }
`)

export default compose(
    graphql(localNodeQuery),
    connect(mapStateToProps, mapDispatchToProps),
)(App);