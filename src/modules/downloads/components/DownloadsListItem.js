import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { getContentState, ContentPurchaseAction } from '../../video/components/ContentPurchaseActions';
import { withStyles } from '@material-ui/core/styles';
import { ButtonBase, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';


class DownloadsListItem extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        content: PropTypes.object.isRequired,
    }
    _watchNowRef;
    constructor() {
        super()
        this.state = {
            hovered: false,
        }
    }
    _setHoverState = (hovered, event) => {
        this.setState({hovered})
    }
    render() {
        const { content, classes } = this.props
        const { isLoadingState, stateCopy, StateIcon, actionRequired, actionCopy } = getContentState(content)
        return (
            <ContentPurchaseAction contentRef={this._watchNowRef} content={content}>{({ action, loading }) => (
                <ListItem 
                    ref={ref => this._watchNowRef = ref} 
                    className={`DownloadsListItem ${classes.root}`} 
                    button={true} 
                    disabled={!action || loading} 
                    onClick={action}
                    onMouseEnter={this._setHoverState.bind(this, true)}
                    onMouseLeave={this._setHoverState.bind(this, false)}
                    >
                    <ListItemIcon className={classes.listItemIcon}>
                        <StateIcon />
                    </ListItemIcon>
                    <ListItemText 
                        primary={content.title}
                        secondary={stateCopy}
                        classes={{
                            primary: classes.listItemPrimaryText,
                            secondary: actionRequired ? classes.listItemSecondaryTextAction : classes.listItemSecondaryText,
                        }}
                    />                    
                    <ListItemSecondaryAction className={`more-actions ${classes.secondaryAction}`}>
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                    {/* <div style={{ overflow: 'hidden', marginRight: 16 }}>
                        <Typography variant="subheading" gutterBottom noWrap>{content.title}</Typography>
                        <Typography variant="body1" component="div" className="action-status">
                            <ContentPurchaseState content={content} />
                        </Typography>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <div className="featured-image" style={{ backgroundImage: `url(${window.AO_CORE_URL}/${content.featuredImageUrl})` }}>
                            {actionRequired ? (
                                <ContentPurchaseAction contentRef={this._watchNowRef} content={content}>{({ action, actionCopy, loading }) => (
                                    <ButtonBase className="action-button" disabled={!action || loading} onClick={action}>
                                        <div className="action-text">
                                            <Typography variant="body1">{actionCopy}</Typography>
                                        </div>
                                    </ButtonBase>
                                )}</ContentPurchaseAction>
                            ) : null}
                        </div>
                    </div> */}
                </ListItem>
            )}</ContentPurchaseAction>
        )
    }
}

const styles = ({palette, spacing}) => ({
    root: {
        alignItems: 'flex-start',
        borderTop: `1px solid ${palette.divider}`,
        padding: `12px 16px`,
    },
    listItemIcon: {
        marginRight: 0,
        width: `24px !important`,
        height: `24px !important`,
    },
    listItemPrimaryText: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        fontWeight: '400',
    },
    listItemSecondaryText: {
        
    },
    listItemSecondaryTextAction: {
        color: palette.primary.main,
    },
    secondaryAction: {
        right: spacing.unit * -3,
        opacity: 0.75,
    }
})

export default withStyles(styles)(DownloadsListItem)