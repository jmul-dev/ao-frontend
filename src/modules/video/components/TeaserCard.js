import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayArrow';
import '../styles/teaser-card.css';


type Props = {
    video: any,
    setVideoPlaybackState: Function,
}

export default class TeaserCard extends Component<Props> {
    _playVideo = () => {
        const { setVideoPlaybackState } = this.props
        setVideoPlaybackState({isActive: true})
    }
    render() {
        const { video, setVideoPlaybackState } = this.props
        return (
            <div className="TeaserCard">
                <div className="media-container">
                    <div className="video-container" style={{backgroundImage: `url(${video.coverImageUrl})`}}></div>
                    <Typography variant="title" className="title">
                        {video.title}
                    </Typography>
                    <div className="action-pane">
                        <Typography variant="body1">{`LIVE | 15 AO | watch for free`}</Typography>
                        <div className="play-button-container">
                            <IconButton onClick={this._playVideo}>
                                <PlayIcon />
                            </IconButton>
                            <Typography variant="subheading">{`Watch`}</Typography>
                        </div>
                    </div>
                </div>
                <div className="content-container">
                    <Grid container spacing={16} alignItems="flex-start" justify="flex-end" style={{height: 800}}>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                {video.description}
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}