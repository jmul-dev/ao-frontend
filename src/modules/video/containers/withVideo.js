import { connect } from 'react-redux'
import { setActiveVideo } from '../reducers/video.reducer'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"
import VideoContentFragment from '../../../graphql/fragments/VideoContentFragment'


// Redux
const mapDispatchToProps = {
    setActiveVideo,
}

const mapStateToProps = (store) => {
    return {
        tokenBalance: store.wallet.tokenBalance,
    }
}

// GraphQL
const videoQuery = gql(`
    query video($id: ID!) {
        video(id: $id) {
            ...VideoContentFragment
        }
    }
    ${VideoContentFragment}
`)

export default compose(    
    connect(mapStateToProps, mapDispatchToProps),
    graphql(videoQuery, {
        name: 'videoQuery',
        // Pull video id from props
        options: (props) => ({
            variables: {
                id: props.video ? props.video.id : props.id
            }
        })
    }),
);