import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import PlayIcon from '@material-ui/icons/PlayArrow';
import withAccountVideos from '../containers/withAccountVideos';
import moment from 'moment';
import '../styles/account-video-listing.css';


class AccountVideoListItem extends Component {
    render() {
        const { video } = this.props
        return (
            <div className="AccountVideoListItem">
                <Grid container spacing={16} alignItems="center">
                    <Grid item sm={4}>
                        <ButtonBase style={{width: '100%'}}>
                            <div className="featured-image" style={{backgroundImage: `url(${video.coverImageUrl})`}}>
                                <PlayIcon className="play-icon" />
                            </div>
                        </ButtonBase>
                    </Grid>
                    <Grid item sm={8}>
                        <Typography variant="heading3" gutterBottom>
                            {video.title}
                        </Typography>
                        <Typography variant="body1" gutterBottom color="textSecondary">
                            {`uploaded: ${moment(video.createdAt).format('M/D/YYYY')}`}
                        </Typography>
                        <Typography variant="body1" gutterBottom color="textSecondary">
                            {`XXX ao earned | ${video.stake}ao staked`}
                        </Typography>
                        <Typography className="description" variant="body1" gutterBottom color="textSecondary">
                            {video.description}
                        </Typography>
                        <ButtonBase className="more-info">
                            {'+ more info'}
                        </ButtonBase>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

class AccountVideoListing extends Component {
    render() {
        const { loading, error, node } = this.props.query
        if ( loading || error )
            return null  // TODO: loading or error state
        if ( !node.creator || !node.creator.content )
            return null // TODO: no user content
        const videos = node.creator.content
        return (
            <div className="AccountVideoListing">
                <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                    {videos.map((video, index) => (
                        <li key={video.id}>
                            <AccountVideoListItem video={video} />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default withAccountVideos(AccountVideoListing)