import { connect } from 'react-redux';
import { listenOnIpcChannel } from '../reducers/electron.reducer'


const mapDispatchToProps = {
    listenOnIpcChannel,
}

const mapStateToProps = (state) => ({
    eventLogs: state.electron.eventLogs
})

export default connect(mapStateToProps, mapDispatchToProps);