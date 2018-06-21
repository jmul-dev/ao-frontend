import Console from '../components/Console'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"

// Redux
const mapStateToProps = (store) => {
    return {
        eventLog: store.console.eventLog
    }
}

// GraphQL
const graphqlQuery = gql(`
    query {
        logs { createdAt, message }
    }
`)

export default compose(
    graphql(graphqlQuery, {pollInterval: 500}),
    connect(mapStateToProps),
)(Console);