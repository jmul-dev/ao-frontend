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
                    <div>{`Videos available: ${statistics.videosAvailable}`}</div>
                    <div>{`Peers connected: ${statistics.peersConnected}`}</div>
                </Typography>
            </div>
        )
    }
}
export default withStatsContainer( Stats )