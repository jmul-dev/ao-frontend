import { connect } from 'react-redux'
import { setActiveVideo, getContentPrice } from '../reducers/video.reducer'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"
import VideoContentFragment from '../../../graphql/fragments/VideoContentFragment'
import DatStatsFragment from '../../../graphql/fragments/DatStatsFragment'

// Redux
const mapDispatchToProps = {
    setActiveVideo,
    getContentPrice,
}

const mapStateToProps = (store, props) => {
    return {
        networkTokenBalance: store.wallet.networkTokenBalance,
    }
}

// GraphQL
export const videoQuery = gql(`
    query video($id: ID!) {
        video(id: $id) {
            ...VideoContentFragment,
            metadataDatStats {
                ...DatStatsFragment
            },
            fileDatStats {
                ...DatStatsFragment
            }
        }
    }
    ${VideoContentFragment}
    ${DatStatsFragment}
`)

export default compose(    
    connect(mapStateToProps, mapDispatchToProps),
    graphql(videoQuery, {
        name: 'videoQuery',
        // Pull video id from props
        options: (props) => {
            let id = null
            if ( props.match && props.match.params.videoId ) {
                id = props.match.params.videoId
            } else if ( props.video ) {
                id = props.video.id
            } else {
                id = props.id
            }
            return {
                variables: { id },
                fetchPolicy: 'cache-and-network',
            }
        }
    }),
);