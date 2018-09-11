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
        searchString: store.video.searchString,
    }
}

// GraphQL
const videosQuery = gql(`
    query videos($query: String) {
        videos(query: $query) {
            id, 
            state,
            title, 
            description, 
            fileName, 
            contentType, 
            fileUrl, 
            featuredImageUrl, 
            teaserUrl, 
            stake
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
                // search
                query: props.searchString
            }
        })
    }),
);