import { connect } from 'react-redux'
import { dismissNotification } from '../reducers/notifications.reducer'


const mapDispatchToProps = {
    dismissNotification,
}

const mapStateToProps = (state) => ({
    notifications: state.notifications.notifications,
})

export default connect(mapStateToProps, mapDispatchToProps)