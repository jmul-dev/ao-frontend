import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { CSSTransition } from 'react-transition-group';
import ReactPlayer from 'react-player'
import '../styles/teaser-card.css';
import { LogoIcon } from '../../../assets/Icons';
import ExchangeModal from '../../exchange/components/ExchangeModal';
import { PrimaryButton } from '../../../theme';
import { TokenBalance } from '../../../utils/denominations';
import withVideo from '../containers/withVideo';
import { ContentPurchaseAction, ContentPurchaseState } from './ContentPurchaseActions';
import DatStats from '../../content/components/DatStats';


type Props = {
    video: Object,
    isActive: boolean,
    isFullscreen: boolean,
    isTeaserEntered: boolean,
    // redux bound state
    tokenBalance: Object,  // bignumber
    // redux bound methods
    setActiveVideo: Function,
    // graphql props
    videoQuery: {
        video: Object,
        refetch: Function,
        loading: boolean,
    }
}

class TeaserCard extends Component<Props> {
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
        const { setActiveVideo, tokenBalance, video, videoQuery } = this.props
        if ( !videoQuery.video )
            return console.warn('attempted playing video before video state was fetched')        
        if ( videoQuery.video.state === 'STAKED' || videoQuery.video.state === 'DISCOVERABLE' ) {
            // A: Video is in a playable state
            setActiveVideo(this.props.video)
        } else if ( videoQuery.video.state === 'DISCOVERED' ) {
            // B: Content has not began the purchase process
            if ( tokenBalance.lt(video.stake) ) {
                // B.1: Exchange modal if balance sucks
                this.setState({exchangeModalOpen: true})
            } else {
                // B.2: TODO: Begin download
                
            }
        } else {
            // C: Content is going through the purchase process
            return null;
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
    _renderActionState = () => {
        let contentState = 'DISCOVERED'
        let content = this.props.video
        if ( this.props.videoQuery.video ) {
            contentState = this.props.videoQuery.video.state
            content = this.props.videoQuery.video
        }
        if ( contentState === 'DISCOVERABLE' ) {
            // User has completed the purchase/host/discovery process, they can now play the video
            return (
                <PrimaryButton onClick={this._playVideo} className="play-button">
                    <ContentPurchaseState content={content} />
                </PrimaryButton>
            )
        } else {
            return (
                <ContentPurchaseAction contentRef={this.refs.videoContainer} content={content}>{({action, loading, error}) => (
                    <PrimaryButton disabled={!action || loading} onClick={action}>
                        <ContentPurchaseState content={content} />
                        {error ? (
                            <div>{typeof error === 'string' ? error : error.message}</div>
                        ) : null}
                    </PrimaryButton>
                )}</ContentPurchaseAction>
            )
        }
    }
    render() {
        const { video, videoQuery, isActive, isFullscreen, isTeaserEntered, tokenBalance } = this.props
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
                                url={`${window.AO_CORE_URL}/${videoSrc}`}
                                config={{
                                    file: {
                                        attributes: {
                                            poster: `${window.AO_CORE_URL}/${video.featuredImageUrl}`,
                                            controlsList: 'nodownload'
                                        }
                                    }
                                }}
                                playing={isTeaserEntered && isActive}
                                width="100%"
                                height="100%"
                                style={{position: 'absolute', top: 0, left: 0}}
                                onReady={usingTeaserSrc ? undefined : this._onVideoSrcReady}
                                onPlay={usingTeaserSrc ? undefined : this._onVideoSrcReady}
                                loop={usingTeaserSrc}
                                controls={!usingTeaserSrc}
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
                            <Typography variant="body1">
                                <TokenBalance baseAmount={video.stake} /> {' / view'}
                            </Typography>
                            <Typography variant="caption" gutterBottom>
                                {`your balance: `}<TokenBalance baseAmount={tokenBalance} />
                            </Typography>
                            {this._renderActionState()}
                            {videoQuery.video ? (
                                <div style={{marginTop: 8}}>
                                    <DatStats stats={[videoQuery.video.metadataDatStats, videoQuery.video.fileDatStats]} />
                                </div>
                            ) : null}
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

export default withVideo(TeaserCard)