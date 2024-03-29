import { connect } from "react-redux";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import {
    setTeaserListingState,
    setActiveVideo
} from "../reducers/video.reducer";

// Redux
const mapDispatchToProps = {
    setTeaserListingState,
    setActiveVideo
};

const mapStateToProps = store => {
    return {
        teaserListingActive: store.video.teaserListingActive,
        activeVideo: store.video.activeVideo,
        searchString: store.video.searchString
    };
};

// GraphQL
const videosQuery = gql(`
    query videos($query: String, $contentType: ContentType!) {
        networkContent(query: $query, contentType: $contentType) {
            ... on VideoContent {
                id, 
                state,
                title, 
                description, 
                fileName, 
                contentType, 
                contentLicense,
                contentAttribution,
                fileUrl, 
                featuredImageUrl, 
                teaserUrl, 
                stake,
                isNetworkContent,
                totalHosts,
                recentlySeenHostsCount,
                lastSeenContentHost {
                    contentHostId,
                    contentDatKey,
                    timestamp
                }
            }
        }
    }
`);

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    graphql(videosQuery, {
        name: "videosQuery",
        // Pull ethAddress input from redux props
        options: props => ({
            variables: {
                query: props.searchString,
                contentType: "VOD"
            },
            pollInterval: 5000
        })
    })
);
