import React, { Component } from 'react';
import TeaserCard from './TeaserCard';
import '../styles/teaser-listing.css';


type Props = {
    videos: [any],
    activeVideoIndex: number,
    activeVideoCellPosition: Object,
    updateActiveVideoIndex: Function,
}

export default class TeaserListing extends Component<Props> {
    constructor() {
        super()
        this.state = {
            videosSlice: []
        }
    }
    componentDidMount() {
        this._getVideosRangeBasedOnActiveIndex(this.props.activeVideoIndex)
    }
    componentWillReceiveProps(nextProps) {
        if ( nextProps.activeVideoIndex !== this.props.activeVideoIndex ) {
            this._getVideosRangeBasedOnActiveIndex(nextProps.activeVideoIndex)
        }
    }
    _getVideosRangeBasedOnActiveIndex = (activeIndex) => {
        const firstIndex = Math.max(0, activeIndex - 2)
        const lastIndex = Math.min(this.props.videos.length, activeIndex + 3)
        let videosSlice = this.props.videos.slice(firstIndex, lastIndex)
        // We pad the front if necessary for placeholder elements
        if ( activeIndex - 2 < 0 )
            videosSlice.unshift(null)
        if ( activeIndex - 2 < -1 )
            videosSlice.unshift(null)
        console.log(videosSlice)
        this.setState({
            videosSlice
        })
    }
    render() {
        const { videosSlice } = this.state
        const { updateActiveVideoIndex, activeVideoIndex } = this.props
        return (
            <div className="TeaserListing">
                <button onClick={this.props.onClose} style={{position: 'fixed', top: 24, left: 24, zIndex: 9999}}>X</button>
                <div className="slider-track">
                    {videosSlice.map((video, index) => {
                        if ( !video )
                            return (<div key={`slide placeholder-${index}`}></div>)
                        return (
                            <div 
                                className={`slide ${index !== 2 ? 'clickable' : 'active'}`} key={video.id} 
                                style={index === 2 ? this.props.activeVideoCellPosition : undefined}
                                onClick={index !== 2 ? () => updateActiveVideoIndex(activeVideoIndex + index - 2) : undefined}
                                >
                                <TeaserCard video={video} />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}