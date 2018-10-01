import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import withHostedContent from '../containers/withHostedContent';
import { withTheme } from '@material-ui/core/styles';
import '../styles/enqueued-videos.css';
import { ContentPurchaseState, ContentPurchaseAction, statesPendingUserAction } from './ContentPurchaseActions';


type Props = {
    // redux bound state
    hideOffcanvas: boolean,
    // redux bound methods

    // graphql props
    hostedContentQuery: {
        node: Object,
        refetch: Function,
        loading: boolean,
    }
}

class EnqueuedVideos extends Component<Props> {
    componentDidUpdate() {
        this.props.hostedContentQuery.startPolling(1500)
    }
    componentWillUnmount() {
        this.props.hostedContentQuery.stopPolling()
    }
    render() {
        const { loading, node } = this.props.hostedContentQuery
        if (loading)
            return null;
        if (!node || (node && !node.hostedContent))
            return null;  // no incomplete hosted content        
        const { recentlyHostedContentIds } = this.props
        const incompleteContent = node.hostedContent.filter(content => {
            // incomplete
            if ( content.state !== 'STAKED' && content.state !== 'DISCOVERABLE' )
                return true;
            // completed recently (still show in enqueued videos)
            if ( recentlyHostedContentIds.indexOf(content.id) > -1 )
                return true;
            return false;
        })
        return (
            <div className="EnqueuedVideos" style={{transform: this.props.hideOffcanvas ? `translateY(100px)` : undefined }}>
                <ul>
                    {incompleteContent.map(content => (
                        <li key={content.id}>
                            <EnqueuedVideoListItem content={content} />
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

class EnqueuedVideoListItemComponent extends Component {
    _watchNowRef;
    render() {
        const { theme, content } = this.props
        const actionRequired = statesPendingUserAction.indexOf(content.state) > -1
        return (
            <div ref={ref => this._watchNowRef = ref} className="EnqueuedVideo" style={{ backgroundColor: actionRequired ? theme.palette.primary.main : theme.palette.background.default}}>
                <div style={{ overflow: 'hidden', marginRight: 16 }}>
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
                </div>
            </div>
        )
    }
}
const EnqueuedVideoListItem = withTheme()(EnqueuedVideoListItemComponent)

export default withHostedContent(EnqueuedVideos)