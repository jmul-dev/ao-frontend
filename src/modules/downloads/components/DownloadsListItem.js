import { ButtonBase, Typography } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
    ContentPurchaseAction,
    getContentState
} from "../../video/components/ContentPurchaseActions";
import CancelDownloadConfirmationDialog from "./CancelDownloadConfirmationDialog";

class DownloadsListItem extends Component {
    static propTypes = {
        currentUserEthAddress: PropTypes.string.isRequired,
        classes: PropTypes.object.isRequired,
        content: PropTypes.object.isRequired,
        hideBorder: PropTypes.bool
    };
    constructor() {
        super();
        this.state = {
            actionsMenuActive: false,
            actionsMenuAnchor: null,
            cancelDialogOpen: false
        };
    }
    _setActionsMenuState = (active, event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.setState({
            actionsMenuActive: active,
            actionsMenuAnchor: event ? event.currentTarget : null
        });
        return null;
    };
    _openCancelDialog = () => {
        this.setState({ cancelDialogOpen: true });
    };
    render() {
        const {
            content,
            classes,
            currentUserEthAddress,
            hideBorder
        } = this.props;
        const contentInCancelableState =
            ["STAKING", "STAKED", "DISCOVERABLE"].indexOf(content.state) === -1;
        const { stateCopy, StateIcon, actionRequired } = getContentState(
            content,
            currentUserEthAddress
        );
        return (
            <ContentPurchaseAction content={content}>
                {({ action, loading, cancelAction }) => (
                    <ListItem
                        className={`${classes.root} ${
                            hideBorder ? classes.rootNoBorder : ""
                        }`}
                        disabled={
                            !action || loading || this.state.actionsMenuActive
                        }
                    >
                        <ListItemIcon className={classes.listItemIcon}>
                            <StateIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={content.title}
                            secondary={stateCopy}
                            classes={{
                                primary: classes.listItemPrimaryText,
                                secondary: actionRequired
                                    ? classes.listItemSecondaryTextAction
                                    : classes.listItemSecondaryText
                            }}
                        />
                        <ListItemSecondaryAction
                            className={`more-actions ${
                                classes.secondaryAction
                            }`}
                        >
                            <ButtonBase
                                className={classes.secondaryActionButton}
                                onClick={this._setActionsMenuState.bind(
                                    this,
                                    true
                                )}
                            >
                                <MoreVertIcon />
                            </ButtonBase>
                        </ListItemSecondaryAction>
                        <Menu
                            anchorEl={this.state.actionsMenuAnchor}
                            open={this.state.actionsMenuActive}
                            onClose={this._setActionsMenuState.bind(
                                this,
                                false
                            )}
                        >
                            <MenuItem
                                disabled
                                className={classes.menuItemTitle}
                            >
                                <Typography noWrap variant="caption">
                                    {content.title}
                                </Typography>
                            </MenuItem>
                            <MenuItem
                                component={Link}
                                to={`/app/view/account/${content.contentType.toLowerCase()}/${
                                    content.id
                                }`}
                                onMouseUp={this._setActionsMenuState.bind(
                                    this,
                                    false
                                )}
                            >
                                Details
                            </MenuItem>
                            {!loading && action && (
                                <MenuItem
                                    onClick={action}
                                    onMouseUp={this._setActionsMenuState.bind(
                                        this,
                                        false
                                    )}
                                >
                                    {stateCopy}
                                </MenuItem>
                            )}
                            <MenuItem
                                onClick={this._openCancelDialog}
                                onMouseUp={this._setActionsMenuState.bind(
                                    this,
                                    false
                                )}
                                disabled={loading || !contentInCancelableState}
                                className={classes.cancelButton}
                            >
                                Cancel Download
                            </MenuItem>
                        </Menu>
                        <CancelDownloadConfirmationDialog
                            open={this.state.cancelDialogOpen}
                            onConfirm={() => {
                                cancelAction();
                                this.setState({ cancelDialogOpen: false });
                            }}
                            onCancel={() => {
                                this.setState({ cancelDialogOpen: false });
                            }}
                        />
                    </ListItem>
                )}
            </ContentPurchaseAction>
        );
    }
}

const styles = ({ palette, spacing }) => ({
    root: {
        alignItems: "flex-start",
        borderTop: `1px solid ${palette.divider}`,
        padding: `12px 0 12px 16px`,
        pointerEvents: "auto !important"
    },
    rootNoBorder: {
        borderTop: 0
    },
    listItemIcon: {
        marginRight: 0,
        width: `24px !important`,
        height: `24px !important`
    },
    listItemPrimaryText: {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        fontWeight: "400",
        overflow: "hidden"
    },
    listItemSecondaryText: {},
    listItemSecondaryTextAction: {
        color: palette.primary.main
    },
    secondaryAction: {
        width: 24,
        height: "100%",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        right: -24,
        opacity: 0.75
    },
    secondaryActionButton: {
        height: "100%",
        color: "white"
    },
    cancelButton: {
        color: palette.error.main
    },
    menuItemTitle: {
        borderBottom: `1px solid #AAAAAA`
    }
});

export default withStyles(styles)(DownloadsListItem);
