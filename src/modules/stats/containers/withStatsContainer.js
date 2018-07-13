import { graphql } from 'react-apollo'
import gql from "graphql-tag"


// GraphQL
const statsQuery = gql(`
    query {
        statistics {
            peersConnected, videosAvailable
        }
    }
`)

export default graphql(statsQuery, {
    name: 'query',
});