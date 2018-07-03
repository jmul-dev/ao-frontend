import TeaserCard from '../components/TeaserCard'
import { connect } from 'react-redux'
import { setVideoPlaybackState } from '../reducers/video.reducer'


// Redux
const mapDispatchToProps = {
    setVideoPlaybackState,
}

const mapStateToProps = (store) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TeaserCard);