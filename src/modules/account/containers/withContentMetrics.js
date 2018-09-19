import { connect } from 'react-redux'
import { getContentMetrics, getPurchaseReceipt } from '../reducers/account.reducer'

const mapDispatchToProps = {
    getContentMetrics,
    getPurchaseReceipt,
}

const mapStateToProps = (state, props) => ({
    metrics: state.account.contentMetrics[props.video.stakeId]
})

export default connect(mapStateToProps, mapDispatchToProps);