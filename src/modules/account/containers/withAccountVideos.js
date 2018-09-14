import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import gql from "graphql-tag"
import VideoContentFragment from '../../../graphql/fragments/VideoContentFragment'
import DatStatsFragment from '../../../graphql/fragments/DatStatsFragment';

// GraphQL
const accountVideos = gql(`
    query {
        node {
            id,
            stakedContent {
                ...VideoContentFragment,
                metadataDatStats {
                    ...DatStatsFragment
                },
                fileDatStats {
                    ...DatStatsFragment
                }
            },
            hostedContent {
                ...VideoContentFragment,
                metadataDatStats {
                    ...DatStatsFragment
                },
                fileDatStats {
                    ...DatStatsFragment
                }
            }
        }
    }
    ${VideoContentFragment}
    ${DatStatsFragment}
`)

const mapStateToProps = (state) => ({
    filter: state.account.videoListingFilter,
    ordering: state.account.videoListingOrdering,
})

export default compose(
    graphql(accountVideos, {
        name: 'query',
        options: (props) => ({
            pollInterval: 1500,
            variables: {
                // offset
                // limit
            },            
        })
    }),
    connect(mapStateToProps)
);