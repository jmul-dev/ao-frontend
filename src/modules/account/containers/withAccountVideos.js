import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"
import VideoContentFragment from '../../../graphql/fragments/VideoContentFragment'

// GraphQL
const accountVideos = gql(`
    query {
        node {
            id,
            stakedContent {
                ...VideoContentFragment   
            }
            hostedContent {
                ...VideoContentFragment
            }
        }
    }
    ${VideoContentFragment}
`)

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
);