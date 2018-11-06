import React, { Component } from 'react';
import TeaserCard from './TeaserCard';
import '../styles/teaser-listing.css';


type Props = {
    videos: [any],
    activeTeaserVideoIndex: number,
    activeTeaserVideoCellPosition: Object,
    activeFullscreenVideo: Object,
    updateActiveVideoIndex: Function,
    enteredTeaser: boolean,
}

export default class TeaserListing extends Component<Props> {
    constructor() {
        super()
        this.state = {
            videosSlice: []
        }
        this._boundNavigationKeyListener = this._navigationKeyListener.bind(this)
    }
    componentDidMount() {
        this._getVideosRangeBasedOnActiveIndex(this.props.activeTeaserVideoIndex)
        document.addEventListener("keydown", this._boundNavigationKeyListener, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this._boundNavigationKeyListener, false);
    }
    componentWillReceiveProps(nextProps) {
        if ( nextProps.activeTeaserVideoIndex !== this.props.activeTeaserVideoIndex ) {
            this._getVideosRangeBasedOnActiveIndex(nextProps.activeTeaserVideoIndex)
        }
    }
    _navigationKeyListener = (event) => {
        const { activeTeaserVideoIndex, updateActiveVideoIndex } = this.props
        if ( event.keyCode === 37 || event.keyCode === 39 ) {  // left arrow, right arrow
            if ( event.keyCode === 37 ) {
                updateActiveVideoIndex(activeTeaserVideoIndex - 1)
            } else {
                updateActiveVideoIndex(activeTeaserVideoIndex + 1)
            }
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
        this.setState({
            videosSlice
        })
    }
    render() {
        const { videosSlice } = this.state
        const { updateActiveVideoIndex, activeTeaserVideoIndex, activeFullscreenVideo, enteredTeaser } = this.props
        return (
            <div className="TeaserListing">                
                <div className="slider-track">
                    {videosSlice.map((video, index) => {
                        if ( !video )
                            return (<div key={`slide placeholder-${index}`}></div>)
                        const slideIsFullscreen = activeFullscreenVideo && activeFullscreenVideo.id === video.id
                        const slideIsActive = index === 2
                        return (
                            <div 
                                className={`slide ${index !== 2 ? 'clickable' : 'active'} ${slideIsFullscreen ? 'fullscreen' : ''} ${video.recentlySeenHostsCount === 0 && 'no-recent-hosts'}`} key={video.id} 
                                style={index === 2 ? this.props.activeTeaserVideoCellPosition : undefined}
                                onClick={index !== 2 ? () => updateActiveVideoIndex(activeTeaserVideoIndex + index - 2) : undefined}
                                >
                                <TeaserCard 
                                    video={video}                                    
                                    isActive={slideIsActive}
                                    isFullscreen={slideIsFullscreen}
                                    isTeaserEntered={enteredTeaser}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}