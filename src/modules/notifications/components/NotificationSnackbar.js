import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
const variantIcon = {
    warning: InfoIcon,
    error: ErrorOutlineIcon,
    success: CheckCircleIcon,
}

const snackbarStyles = ({palette, spacing}) => ({
    // Snackbar
    root: {
        left: 0,
        right: 0,
        width: '100%',
        transform: 'none',
    },
    // SnackbarContent
    contentRoot: {
        width: '100%',
        maxWidth: '100%',
        borderRadius: 0,
        justifyContent: 'center',
        flexWrap: 'no-wrap',
    },
    action: {
        marginLeft: 'initial',
    },
    message: {
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: spacing.unit * (6 + 3),  // 6 for left icon, 3 for text spacing
        paddingRight: spacing.unit * 3,  // 3 for text spacing
        maxHeight: 40,
        overflow: 'auto',
    },
    variantIcon: {
        position: 'absolute',
        left: spacing.unit * 3,
    },
    // variants
    warning: {
        background: palette.warning.main
    },
    error: {
        background: palette.error.main
        // background: palette.error.main
    },
    success: {
        background: palette.primary.main
        // background: palette.primary.main
    },
})

const NotificationSnackbar = ({classes, variant, message, action, theme, onDismiss, ...props}) => {
    const Icon = variantIcon[variant]
    let actions = []
    if ( action === 'dismiss' ) {
        actions.push((
            <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.action}
                onClick={onDismiss}
            >
                <CloseIcon className={classes.icon} />
            </IconButton>
        ))
    }
    return (
        <Snackbar
            {...props}
            className={classes.root}            
        >
            <SnackbarContent
                className={classNames(classes.contentRoot, classes[variant])}
                classes={{
                    action: classes.action,  
                    message: classes.message,                  
                }}                
                message={
                    <div className={classes.message}>
                        <Icon className={classes.variantIcon} />
                        {message}
                    </div>
                }
                action={actions}
                aria-describedby="notification"
            />
        </Snackbar>
    )
}

NotificationSnackbar.propTypes = {
    message: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['warning', 'error', 'success']).isRequired,
    action: PropTypes.oneOf(['dismiss']).isRequired,
    onDismiss: PropTypes.func.isRequired,
}

NotificationSnackbar.defaultProps = {
    variant: 'warning',
    action: 'dismiss',
}

export default withStyles(snackbarStyles, {withTheme: true})( NotificationSnackbar )