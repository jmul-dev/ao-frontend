import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import gql from "graphql-tag"
import VideoContentFragment from '../../../graphql/fragments/VideoContentFragment'

// GraphQL
const accountVideos = gql(`
    query {
        node {
            id,
            stakedContent {
                ...VideoContentFragment   
            },
            hostedContent {
                ...VideoContentFragment
            }
        }
    }
    ${VideoContentFragment}
`)

const mapStateToProps = (state) => ({
    filter: state.account.videoListingFilter,
    ordering: state.account.videoListingOrdering,
})

export default compose(
    graphql(accountVideos, {
        name: 'query',
        options: (props) => ({
            variables: {
                // offset
                // limit
            }
        })
    }),
    connect(mapStateToProps)
);