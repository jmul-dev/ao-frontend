import React, { Component } from 'react';
import withStatsContainer from '../containers/withStatsContainer';
import Typography from '@material-ui/core/Typography';


class Stats extends Component {    
    render() {
        const { statistics, loading, error } = this.props.query
        if ( loading || error )
            return null
        return (
            <div className="Stats">
                <Typography variant="body1" component="div">
                    <div>{`Content hosts: ${statistics.p2pRecentlySeenHostsCount}`}</div>
                    <div>{`Peers connected: ${statistics.p2pPeersConnected}`}</div>
                </Typography>
            </div>
        )
    }
}
export default withStatsContainer( Stats )