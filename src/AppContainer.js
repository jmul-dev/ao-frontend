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
const graphqlQuery = gql(`
    query {
        isRegistered
    }
`)

export default compose(
    graphql(graphqlQuery),
    connect(mapStateToProps, mapDispatchToProps),
)(App);