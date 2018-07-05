import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayArrow';
import { CSSTransition } from 'react-transition-group';
import ReactPlayer from 'react-player'
import '../styles/teaser-card.css';


type Props = {
    video: Object,
    isActive: boolean,
    isFullscreen: boolean,
    isTeaserEntered: boolean,
    setActiveVideo: Function,
}

export default class TeaserCard extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            videoSrc: props.video.teaserUrl,
            usingTeaserSrc: true,
            videoSrcReady: false,
        }
    }
    _playVideo = () => {
        const { setActiveVideo } = this.props
        setActiveVideo(this.props.video)
    }
    _onEnteredFullscreen = () => {
        this.setState({
            videoSrc: this.props.video.fileUrl,
            usingTeaserSrc: false,
        })
    }
    _onVideoSrcReady = () => {
        this.setState({
            videoSrcReady: true,
        })
    }
    _onExitingFullscreen = () => {}
    render() {
        const { video, isActive, isFullscreen, isTeaserEntered } = this.props
        const { teaserPlaying, videoSrc, usingTeaserSrc, videoSrcReady } = this.state
        return (
            <CSSTransition
                in={isFullscreen}
                timeout={300}
                classNames="TeaserCard-fullscreen"
                onEntered={this._onEnteredFullscreen}
                onExiting={this._onExitingFullscreen}
            >
                <div className="TeaserCard">
                    <div className="media-container">                    
                        <div 
                            ref="videoContainer" 
                            className="video-container" 
                            onClick={isActive ? this._playVideo : undefined}
                            >
                            <ReactPlayer 
                                key={videoSrc /* Unmounts on src change. TODO: factor fullscreen video into VideoPlayback component */}
                                url={videoSrc}
                                config={{
                                    file: {
                                        attributes: {
                                            poster: video.coverImageUrl
                                        }
                                    }
                                }}
                                playing={isTeaserEntered && isActive}
                                width="100%"
                                height="100%"
                                style={{position: 'absolute', top: 0, left: 0}}
                                onReady={usingTeaserSrc ? undefined : this._onVideoSrcReady}
                            />
                            {!videoSrcReady ? (
                                <div className="loading-overlay"></div>
                            ):null}                            
                        </div>
                        <Typography variant="title" className="title">
                            {video.title}
                        </Typography>
                        <div className="action-pane hide-fullscreen">
                            <Typography variant="body1">{`LIVE | 15 AO | watch for free`}</Typography>
                            <div className="play-button-container">
                                <IconButton onClick={this._playVideo}>
                                    <PlayIcon />
                                </IconButton>
                                <Typography variant="subheading">{`Watch`}</Typography>
                            </div>
                        </div>
                    </div>
                    <div className="content-container hide-fullscreen">
                        <Grid container spacing={16} alignItems="flex-start" justify="flex-end" style={{height: 800}}>
                            <Grid item xs={6}>
                                <Typography variant="body1">
                                    {video.description}
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}