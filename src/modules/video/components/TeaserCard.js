import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PlayIcon from '@material-ui/icons/PlayArrow';
import { CSSTransition } from 'react-transition-group';
import ReactPlayer from 'react-player'
import '../styles/teaser-card.css';
import { LogoIcon } from '../../../assets/Icons';
import ExchangeModal from '../../exchange/components/ExchangeModal';
import { PrimaryButton } from '../../../theme';


type Props = {
    video: Object,
    isActive: boolean,
    isFullscreen: boolean,
    isTeaserEntered: boolean,
    // redux bound state
    tokenBalance: Object,  // bignumber
    // redux bound methods
    setActiveVideo: Function,
}

export default class TeaserCard extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            videoSrc: props.video.teaserUrl,
            usingTeaserSrc: true,
            videoSrcReady: false,
            exchangeModalOpen: false,
        }
    }
    _onExchangeModalClose = () => {
        this.setState({exchangeModalOpen: false})
    }
    _playVideo = () => {
        const { setActiveVideo, tokenBalance, video } = this.props
        if ( tokenBalance.lt(video.stake) ) {
            this.setState({exchangeModalOpen: true})
        } else {
            setActiveVideo(this.props.video)
        }
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
        const { video, isActive, isFullscreen, isTeaserEntered, tokenBalance } = this.props
        const { videoSrc, usingTeaserSrc, videoSrcReady } = this.state
        const insufficientBalance = tokenBalance.lt(video.stake) ? tokenBalance.minus(video.stake).multipliedBy(-1).toNumber() : undefined
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
                                key={usingTeaserSrc ? 'teaser' : 'video' /* Unmounts on src change. TODO: factor fullscreen video into VideoPlayback component */}
                                url={videoSrc}
                                config={{
                                    file: {
                                        attributes: {
                                            poster: video.featuredImageUrl
                                        }
                                    }
                                }}
                                playing={isTeaserEntered && isActive}
                                width="100%"
                                height="100%"
                                style={{position: 'absolute', top: 0, left: 0}}
                                onReady={usingTeaserSrc ? undefined : this._onVideoSrcReady}
                                onPlay={usingTeaserSrc ? undefined : this._onVideoSrcReady}
                            />
                            {!videoSrcReady ? (
                                <div className="loading-overlay">
                                    <LogoIcon />
                                </div>
                            ):null}
                        </div>
                        <Typography variant="subheading" className="title">
                            {video.title}
                        </Typography>
                        <div className="action-pane hide-fullscreen">
                            <Typography variant="body1">{`${video.stake} AO / view`}</Typography>
                            <Typography variant="caption">{`your balance: ${tokenBalance.toNumber()} AO`}</Typography>
                            <PrimaryButton onClick={this._playVideo} className="play-button">
                                <div className="play-icon">
                                    <PlayIcon />
                                </div>
                                <Typography variant="subheading">{`watch now`}</Typography>
                            </PrimaryButton>
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
                    {insufficientBalance ? (
                        <ExchangeModal 
                            open={this.state.exchangeModalOpen}
                            onClose={this._onExchangeModalClose}
                            exchangeProps={{
                                title: 'You have insufficient funds',
                                subtitle: 'Purchase more ao to continue streaming.',
                                requiredTokenAmount: insufficientBalance
                            }}
                        />
                    ) : null}
                </div>
            </CSSTransition>
        )
    }
}