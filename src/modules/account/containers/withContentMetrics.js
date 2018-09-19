import { connect } from 'react-redux'
import { getContentMetrics } from '../reducers/account.reducer'

const mapDispatchToProps = {
    getContentMetrics,
}

const mapStateToProps = (state, props) => ({
    metrics: state.account.contentMetrics[props.video.stakeId]
})

export default connect(mapStateToProps, mapDispatchToProps);