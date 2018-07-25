import { connect } from 'react-redux';


const mapStateToProps = (state) => ({
    eventLogs: state.electron.eventLogs
})

export default connect(mapStateToProps);