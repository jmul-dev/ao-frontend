import Register from '../components/Register'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"

// Redux
const mapStateToProps = (store) => {
    return {
        app: store.app
    }
}

// GraphQL
const graphqlQuery = gql(`
    query {
        logs { createdAt, message }
    }
`)

export default compose(
    graphql(graphqlQuery),
    connect(mapStateToProps),
)(Register);