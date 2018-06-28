import Console from '../components/Console'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"

// GraphQL
const graphqlQuery = gql(`
    query {
        state,
        logs { createdAt, message }
    }
`)

export default compose(
    graphql(graphqlQuery, {
        options: {
            pollInterval: 500
        }
    }),
)(Console);