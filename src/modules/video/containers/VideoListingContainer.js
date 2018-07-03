import VideoListing from '../components/VideoListing'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"


// Redux
const mapStateToProps = (store) => {
    return {
        // TODO: search/filters/pagination
    }
}

// GraphQL
const videosQuery = gql(`
    query {
        videos {
            id, title, description, fileName, contentType, fileUrl, coverImageUrl
        }
    }
`)

export default compose(    
    connect(mapStateToProps),
    graphql(videosQuery, {
        name: 'videos',
        // Pull ethAddress input from redux props
        options: (props) => ({
            variables: {
                // offset
                // limit
            }
        })
    }),
)(VideoListing);