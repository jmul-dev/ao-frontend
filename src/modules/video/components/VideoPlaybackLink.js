import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import withVideoPlaybackAction from '../containers/withVideoPlaybackAction';


const propertySelection = (({ top, right, bottom, left, width, height }) => ({ top, right, bottom, left, width, height }))

class VideoPlaybackLink extends Component {
    static propTypes = {
        contentId: PropTypes.string.isRequired,
        // redux bound actions
        setVideoPlayback: PropTypes.func.isRequired,
        // ...ButtonBase props
        disableRipple: PropTypes.bool,        
    }
    _handlePlaybackClick = (event) => {
        const initialPosition = propertySelection(event.currentTarget.getBoundingClientRect())
        this.props.setVideoPlayback({
            initialPosition,
            contentId: this.props.contentId,
        })
    }
    render() {
        const { contentId, setVideoPlayback, ...props } = this.props
        return (
            <ButtonBase ref="playbackLink" {...props} onClick={this._handlePlaybackClick}>
                {this.props.children}
            </ButtonBase>
        )
    }
}
export default withVideoPlaybackAction(VideoPlaybackLink)