import React, { Component } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import {
    getContentState,
    ContentPurchaseAction
} from "../../video/components/ContentPurchaseActions";
import { withStyles } from "@material-ui/core/styles";
import { ButtonBase, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from "react-router-dom";

class DownloadsListItem extends Component {
    static propTypes = {
        currentUserEthAddress: PropTypes.string.isRequired,
        classes: PropTypes.object.isRequired,
        content: PropTypes.object.isRequired
    };
    _watchNowRef;
    constructor() {
        super();
        this.state = {
            actionsMenuActive: false,
            actionsMenuAnchor: null
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
    _cancelContentPurchase = event => {
        event.preventDefault();
        event.stopPropagation();
        // TODO
    };
    render() {
        const { content, classes, currentUserEthAddress } = this.props;
        const { actionsMenuActive } = this.state;
        const {
            isLoadingState,
            stateCopy,
            StateIcon,
            actionRequired,
            actionCopy
        } = getContentState(content, currentUserEthAddress);
        console.log(`Watch now ref:`, this._watchNowRef);
        return (
            <ContentPurchaseAction
                contentRef={this._watchNowRef}
                content={content}
            >
                {({ action, loading }) => (
                    <ListItem
                        buttonRef={ref => {
                            this._watchNowRef = ref;
                        }}
                        className={`DownloadsListItem ${classes.root}`}
                        button={true}
                        disabled={!action || loading}
                        onClick={action}
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
                            <IconButton
                                onClick={this._setActionsMenuState.bind(
                                    this,
                                    true
                                )}
                            >
                                <MoreVertIcon />
                            </IconButton>
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
                                component={Link}
                                to={`/app/view/account/${content.contentType.toLowerCase()}/${
                                    content.id
                                }`}
                                onMouseUp={this._setActionsMenuState.bind(
                                    this,
                                    false
                                )}
                            >
                                More info
                            </MenuItem>
                            {/* <MenuItem onClick={this._cancelContentPurchase} onMouseUp={this._setActionsMenuState.bind(this, false)}>Cancel</MenuItem> */}
                        </Menu>
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
        padding: `12px 16px`,
        pointerEvents: "auto !important"
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
        right: 0,
        opacity: 0.75
    }
});

export default withStyles(styles)(DownloadsListItem);
