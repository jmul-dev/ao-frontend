import VideoListing from '../components/VideoListing'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"
import { setTeaserListingState, setVideoPlaybackState } from '../reducers/video.reducer'


// Redux
const mapDispatchToProps = {
    setTeaserListingState,
    setVideoPlaybackState,
}

const mapStateToProps = (store) => {
    return {
        teaserListingActive: store.video.teaserListingActive,
        videoPlaybackActive: store.video.videoPlaybackActive,
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