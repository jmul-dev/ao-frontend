import VideoListing from '../components/VideoListing'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"
import { setTeaserListingState, setActiveVideo } from '../reducers/video.reducer'


// Redux
const mapDispatchToProps = {
    setTeaserListingState,
    setActiveVideo,
}

const mapStateToProps = (store) => {
    return {
        teaserListingActive: store.video.teaserListingActive,
        activeVideo: store.video.activeVideo,
    }
}

// GraphQL
const videosQuery = gql(`
    query {
        videos {
            id, title, description, fileName, contentType, fileUrl, coverImageUrl, teaserUrl
        }
    }
`)

export default compose(    
    connect(mapStateToProps, mapDispatchToProps),
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