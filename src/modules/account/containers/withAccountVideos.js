import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"


// GraphQL
const accountVideos = gql(`
    query {
        node {
            id,
            creator {
                content {
                    id, 
                    title, 
                    description, 
                    fileName, 
                    contentType, 
                    fileUrl,
                    coverImageUrl,
                    teaserUrl,
                    stake,
                    split,
                    createdAt,
                }
            }
        }
    }
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