import { connect } from 'react-redux'
import { setVideoPlayback } from '../reducers/video.reducer'

const mapDispatchToProps = {
    setVideoPlayback,
}

const mapStateToProps = (store) => {
    return {
        videoPlayback: store.video.videoPlayback
    }
}

export default connect(mapStateToProps, mapDispatchToProps)