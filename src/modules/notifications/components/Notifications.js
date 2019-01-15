import React, { Component } from "react";
import NotificationSnackbar from "./NotificationSnackbar";
import withNotifications from "../containers/withNotifications";
import CloseIcon from "@material-ui/icons/Close";

class Notifications extends Component {
    _dismissNotification = id => {
        this.props.dismissNotification(id);
    };
    render() {
        const { notifications } = this.props;
        return (
            <React.Fragment>
                {notifications.map((notification, index) => {
                    let action = notification.action;
                    let ActionIcon = notification.ActionIcon;
                    if (action === "dismiss") {
                        action = this._dismissNotification.bind(
                            this,
                            notification.id
                        );
                        ActionIcon = CloseIcon;
                    }
                    return (
                        <NotificationSnackbar
                            key={notification.id}
                            open={index === 0 && !notification.dismiss}
                            variant={notification.variant}
                            hideVarientIcon={notification.hideVarientIcon}
                            message={notification.message}
                            action={action}
                            ActionIcon={ActionIcon}
                        />
                    );
                })}
            </React.Fragment>
        );
    }
}

export default withNotifications(Notifications);
