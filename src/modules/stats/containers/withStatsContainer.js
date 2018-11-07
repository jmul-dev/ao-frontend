import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"
import { connect } from 'react-redux'
import { getNetworkName } from '../../../store/app.reducer'

// GraphQL
const statsQuery = gql(`
    query {
        statistics {
            status,
            coreVersion,
            p2pStatus,
            p2pPeersConnected,
            p2pRecentlySeenHostsCount,
            ethNetworkStatus,
            ethNetworkId,
            totalContentHosts,
        }
    }
`)

// Redux state
const mapStateToProps = (store) => {
    return {
        ethNetworkId: store.app.ethNetworkId,
        ethNetworkName: getNetworkName(store.app.ethNetworkId, false),
        desktopVersion: store.electron.desktopVersion,
    }
}

export default compose(
    graphql(statsQuery, {
        name: 'query',
        options: {
            pollInterval: 5000
        }
    }),
    connect(mapStateToProps),
)
