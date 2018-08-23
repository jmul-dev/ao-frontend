import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"
import VideoContentFragment from '../../../graphql/fragments/VideoContentFragment'

// GraphQL
const accountVideos = gql(`
    query {
        node {
            id,
            content {
                staked {
                    ...VideoContentFragment
                },
                hosted {
                    ...VideoContentFragment
                }
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