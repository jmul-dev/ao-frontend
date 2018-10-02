import React, { Component } from 'react';
import withHostedContent from '../containers/withHostedContent';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import DownloadsListItem from './DownloadsListItem';
import Divider from '@material-ui/core/Divider';
import '../styles/downloads-list.css';
import { Typography } from '@material-ui/core';


class DownloadsList extends Component<Props> {
    static propTypes = {
        // redux bound state
        recentlyHostedContentIds: PropTypes.arrayOf(PropTypes.string).isRequired,
        // graphql
        hostedContentQuery: PropTypes.shape({
            node: PropTypes.shape({
                hostedContent: PropTypes.arrayOf(PropTypes.object),
            })
        })
    }
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
        return incompleteContent.length > 0 ? (
            <div className="DownloadsList">
                <Typography variant="caption" style={{padding: 16}}>{'Active Downloads'}</Typography>
                <Divider />
                <List dense={true}>
                    {incompleteContent.map(content => (
                        <DownloadsListItem key={content.id} content={content} />
                    ))}
                </List>
            </div>
        ) : null
    }
}

export default withHostedContent(DownloadsList)