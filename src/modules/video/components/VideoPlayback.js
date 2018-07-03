import React, { Component } from 'react';
import '../styles/video-playback.css';


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