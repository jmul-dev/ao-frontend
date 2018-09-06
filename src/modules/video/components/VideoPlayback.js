import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import '../styles/video-playback.css';
import withVideoPlaybackAction from '../containers/withVideoPlaybackAction';


const propertySelection = (({ top, right, bottom, left, width, height }) => ({ top, right, bottom, left, width, height }))

class PlaybackLinkButton extends Component {
    _handlePlaybackClick = (event) => {
        const initialPosition = propertySelection(event.currentTarget.getBoundingClientRect())
        this.props.setPlaybackVideo({
            initialPosition,
            contentId: this.props.contentId,
        })
    }
    render() {
        const { contentId, ...props } = this.props
        return (
            <ButtonBase ref="playbackLink" {...props} onClick={this._handlePlaybackClick}>
                {this.props.children}
            </ButtonBase>
        )
    }
}
export const PlaybackLink = withVideoPlaybackAction(PlaybackLinkButton)

type Props = {
    video: any,
    initialPosition: Object,
}

export default class VideoPlayback extends Component<Props> {
    render() {
        const { video } = this.props
        return (
            <div className="VideoPlayback">
                <div className="inner-container" style={this.props.initialPosition}>
                    [todo]
                </div>                
            </div>
        )
    }
}