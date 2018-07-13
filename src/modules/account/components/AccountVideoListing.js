import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withAccountVideos from '../containers/withAccountVideos';
import '../styles/account-video-listing.css';


class AccountVideoListItem extends Component {
    render() {
        const { video } = this.props
        return (
            <div className="AccountVideoListItem">
                <Grid container spacing={16}>
                    <Grid item sm={4}>
                        <div className="featured-image" style={{backgroundImage: `url(${video.coverImageUrl})`}}></div>
                    </Grid>
                    <Grid item sm={8}>
                        <Typography variant="subheading" gutterBottom>
                            {video.title}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {`uploaded: ${video.createdAt}`}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {`XXX ao earned | ${video.stake}ao staked`}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {video.description}
                        </Typography>
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