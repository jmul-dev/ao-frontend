import TeaserCard from '../components/TeaserCard'
import { connect } from 'react-redux'
import { setActiveVideo } from '../reducers/video.reducer'


// Redux
const mapDispatchToProps = {
    setActiveVideo,
}

const mapStateToProps = (store) => {
    return {
        activeVideo: store.video.activeVideo,
        tokenBalance: store.wallet.tokenBalance,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeaserCard);