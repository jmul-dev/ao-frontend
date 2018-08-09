import React, { Component } from 'react';
import NotificationSnackbar from './NotificationSnackbar'
import withNotifications from '../containers/withNotifications'


class Notifications extends Component {
    _dismissNotification = (id) => {
        this.props.dismissNotification(id)
    }
    render() {
        const { notifications } = this.props
        return (
            <React.Fragment>
                {notifications.map((notification, index) => (
                    <NotificationSnackbar
                        key={notification.id}
                        open={index === 0 && !notification.dismiss}
                        variant={notification.variant}
                        message={notification.message}
                        action={notification.action}
                        onDismiss={this._dismissNotification.bind(this, notification.id)}
                    />
                ))}
            </React.Fragment>
        )
    }
}

export default withNotifications(Notifications)