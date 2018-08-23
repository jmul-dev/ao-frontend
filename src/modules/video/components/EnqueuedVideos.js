import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import '../styles/teaser-card.css';
import withIncompleteHostedContent from '../containers/withIncompleteHostedContent';


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
        if ( node && !node.hostedContent )
            return null;  // no incomplete hosted content
        return (
            <div style={{position: 'fixed', bottom: 0, right: 0, zIndex: 9999, width: 200, height: 200, background: 'white'}}>
                {`We have some incomplete content`}
            </div>            
        )
    }
}

export default withIncompleteHostedContent(EnqueuedVideos)