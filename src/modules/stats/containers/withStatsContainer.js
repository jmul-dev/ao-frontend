import { graphql } from 'react-apollo'
import gql from "graphql-tag"


// GraphQL
const statsQuery = gql(`
    query {
        statistics {
            status,
            p2pStatus,
            p2pPeersConnected,
            p2pRecentlySeenHostsCount,
            ethNetworkStatus,
            ethNetworkId,
        }
    }
`)

export default graphql(statsQuery, {
    name: 'query',
    options: {
        pollInterval: 5000
    }
});