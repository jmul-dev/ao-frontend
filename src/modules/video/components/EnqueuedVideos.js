import React, { Component, Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import withIncompleteHostedContent from '../containers/withIncompleteHostedContent';
import { withTheme } from '@material-ui/core/styles';
import AlertIcon from '@material-ui/icons/ErrorOutline';
import '../styles/enqueued-videos.css';
import { CircularProgress } from '@material-ui/core';
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
    render() {
        const { loading, error, node } = this.props.incompleteHostedContentQuery
        if ( loading || error )
            return null;
        if ( !node || (node && !node.hostedContent) )
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

const EnqueuedVideoListItem = withTheme()(({theme, content, ...props}) => {
    const actionRequired = statesPendingUserAction.indexOf(content.state) > -1
    const actionText = 'Pay for video'
    const loadingText = 'Downloading...'
    return (
        <div className="EnqueuedVideo" style={{backgroundColor: actionRequired ? theme.palette.primary.main : theme.palette.background.default}}>
            <div style={{overflow: 'hidden', marginRight: 16}}>
                <Typography variant="subheading" gutterBottom noWrap>{content.title}</Typography>
                <Typography variant="body1" component="div" className="action-status">
                    <ContentPurchaseState content={content} />
                    {/* {actionRequired ? (                        
                        <Fragment>
                            <AlertIcon style={{marginRight: 4}} />{'Action required'}
                        </Fragment>
                    ) : (
                        <Fragment>
                            <CircularProgress size={20} style={{marginRight: 8}} />{loadingText}
                        </Fragment>
                    )} */}
                </Typography>
            </div>
            <div style={{marginLeft: 'auto'}}>
                <div className="featured-image" style={{backgroundImage: `url(${window.AO_CORE_URL}/${content.featuredImageUrl})`}}>
                    {actionRequired ? (
                        <ContentPurchaseAction content={content}>{({action, loading}) => (
                            <ButtonBase className="action-button" disabled={!action || loading} onClick={action}>
                                <div className="action-text">
                                    <Typography variant="body1">{actionText}</Typography>                                
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