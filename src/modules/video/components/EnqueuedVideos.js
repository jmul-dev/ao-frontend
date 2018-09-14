import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import withIncompleteHostedContent from '../containers/withIncompleteHostedContent';
import { withTheme } from '@material-ui/core/styles';
import '../styles/enqueued-videos.css';
import { ContentPurchaseState, ContentPurchaseAction, statesPendingUserAction } from './ContentPurchaseActions';


type Props = {
    // redux bound state

    // redux bound methods

    // graphql props
    incompleteHostedContentQuery: {
        node: Object,
        refetch: Function,
        loading: boolean,
    }
}

class EnqueuedVideos extends Component<Props> {
    constructor() {
        super()
        this.state = {
            polling: false
        }
    }
    componentDidUpdate() {
        const { incompleteHostedContentQuery } = this.props
        const numberOfIncomplete = incompleteHostedContentQuery.node ? incompleteHostedContentQuery.node.hostedContent.length : 0
        // If not polling yet and incomplete videos exist, start polling
        if (!this.state.polling && numberOfIncomplete > 0) {
            this._beginPollingEnqueuedVideoContent()
        } else if (this.state.polling && numberOfIncomplete <= 0) {
            this._stopPollingEnqueuedVideoContent()
        }
    }
    componentWillUnmount() {
        if ( this.state.polling )
            this.props.incompleteHostedContentQuery.stopPolling()
    }
    _beginPollingEnqueuedVideoContent = () => {
        this.setState({ polling: true }, () => {
            this.props.incompleteHostedContentQuery.startPolling(1500)
        })
    }
    _stopPollingEnqueuedVideoContent = () => {
        this.setState({ polling: false }, () => {
            this.props.incompleteHostedContentQuery.stopPolling()
        })
    }
    render() {
        const { loading, error, node } = this.props.incompleteHostedContentQuery
        if (loading || error)
            return null;
        if (!node || (node && !node.hostedContent))
            return null;  // no incomplete hosted content
        return (
            <div className="EnqueuedVideos">
                <ul>
                    {node.hostedContent.map(content => (
                        <li key={content.id}>
                            <EnqueuedVideoListItem content={content} />
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

const EnqueuedVideoListItem = withTheme()(({ theme, content, ...props }) => {
    const actionRequired = statesPendingUserAction.indexOf(content.state) > -1
    return (
        <div className="EnqueuedVideo" style={{ backgroundColor: actionRequired ? theme.palette.primary.main : theme.palette.background.default }}>
            <div style={{ overflow: 'hidden', marginRight: 16 }}>
                <Typography variant="subheading" gutterBottom noWrap>{content.title}</Typography>
                <Typography variant="body1" component="div" className="action-status">
                    <ContentPurchaseState content={content} />
                </Typography>
            </div>
            <div style={{ marginLeft: 'auto' }}>
                <div className="featured-image" style={{ backgroundImage: `url(${window.AO_CORE_URL}/${content.featuredImageUrl})` }}>
                    {actionRequired ? (
                        <ContentPurchaseAction content={content}>{({ action, actionCopy, loading }) => (
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
})

export default withIncompleteHostedContent(EnqueuedVideos)