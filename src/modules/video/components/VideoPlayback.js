import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import '../styles/video-playback.css';
import withVideoPlayback from '../containers/withVideoPlayback';
import withVideo from '../containers/withVideo';
import Modal from '@material-ui/core/Modal';
import { CSSTransition } from 'react-transition-group';
import ReactPlayer from 'react-player'
import { LogoIcon } from '../../../assets/Icons';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


class VideoPlaybackModal extends Component {
    static propTypes = {
        // redux bound state
        videoPlayback: PropTypes.shape({
            initialPosition: PropTypes.object,
            contentId: PropTypes.string,
        }),
        // redux bound actions
        setVideoPlayback: PropTypes.func.isRequired,
    }
    constructor() {
        super()
        this.state = {
            open: false,
            videoPlayback: undefined,
        }
    }
    componentWillUnmount() {
        clearTimeout(this._unsetTimeout)
    }
    componentWillReceiveProps( nextProps ) {
        if ( this.props.videoPlayback.contentId !== nextProps.videoPlayback.contentId ) {
            this.setState({
                open: !!nextProps.videoPlayback.contentId
            })
        }
    }
    _close = () => {
        this.setState({open: false})
    }
    _exitPlayback = () => {
        this.setState({open: false})
        this._unsetTimeout = setTimeout(this._unsetVideoPlayback, 250)
    }
    _unsetVideoPlayback = () => {
        this.props.setVideoPlayback({})
    }
    render() {
        const { videoPlayback } = this.props
        return (
            <Modal 
                open={this.state.open}
                onClose={this._exitPlayback}
                onBackdropClick={this._close}
                keepMounted={true}
            >                
                <CSSTransition
                    in={this.state.open}
                    timeout={250}
                    classNames="playback-modal"
                    unmountOnExit
                    exit={false}
                >
                    <div className={`VideoPlaybackModal`} style={videoPlayback.initialPosition}>
                    <IconButton
                        className="playback-close"
                        onClick={this._exitPlayback}
                    >
                        <CloseIcon />
                    </IconButton>
                        <WrappedVideoPlayback id={videoPlayback.contentId} />
                    </div>                    
                </CSSTransition>
            </Modal>            
        )
    }
}

class VideoPlayback extends Component {
    render() {
        const { videoQuery } = this.props
        const { video, loading } = videoQuery
        return (
            <div className="VideoPlayback">
                {loading ? (
                    <div className="loading-overlay">
                        <LogoIcon />
                    </div>
                ) : (
                    <ReactPlayer
                        url={`${window.AO_CORE_URL}/${video.fileUrl}`}
                        config={{
                            file: {
                                attributes: {
                                    poster: `${window.AO_CORE_URL}/${video.featuredImageUrl}`
                                }
                            }
                        }}
                        playing={true}
                        width="100%"
                        height="100%"
                        style={{position: 'absolute', top: 0, left: 0}}
                    />
                )}
            </div>
        )
    }
}

const WrappedVideoPlayback = withVideo(VideoPlayback)

export default withVideoPlayback(VideoPlaybackModal)