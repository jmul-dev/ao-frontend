import React, { Component } from 'react';
import withStatsContainer from '../containers/withStatsContainer';
import Typography from '@material-ui/core/Typography';


class Stats extends Component {    
    render() {
        const { statistics, loading, error } = this.props.query
        if ( loading || error )
            return null
        return (
            <div className="Stats" style={{display: 'flex'}}>
                <Typography variant="caption" component="div" style={{marginLeft: 24}}>
                    {`Content hosts online: ${statistics.p2pRecentlySeenHostsCount}`}
                </Typography>
                <Typography variant="caption" component="div" style={{marginLeft: 24}}>
                    {`Peers connected: ${statistics.p2pPeersConnected}`}
                </Typography>
            </div>
        )
    }
}
export default withStatsContainer( Stats )