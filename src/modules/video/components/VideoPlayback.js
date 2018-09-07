import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import '../styles/video-playback.css';
import withVideoPlayback from '../containers/withVideoPlayback';
import Modal from '@material-ui/core/Modal';


class VideoPlayback extends Component {
    static propTypes = {
        // redux bound state
        videoPlayback: PropTypes.shape({
            initialPosition: PropTypes.object.isRequired,
            contentId: PropTypes.string.isRequired,
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
        this.setState({modalOpen: false})
    }
    _exitPlayback = () => {
        this.setState({modalOpen: false})
        this._unsetTimeout = setTimeout(this._unsetVideoPlayback, 500)        
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
            >
                <div className={`VideoPlayback ${this.state.open ? 'active' : ''}`}>
                    <div className="playback-container" style={videoPlayback.initialPosition}>
                        [todo]
                    </div>                
                </div>
            </Modal>            
        )
    }
}

export default withVideoPlayback(VideoPlayback)