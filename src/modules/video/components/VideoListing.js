// @flow
import React, { Component } from 'react';
import { AutoSizer, ColumnSizer, Grid } from 'react-virtualized';
import 'react-virtualized/styles.css';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import '../styles/video-listing.css';
import TeaserListing from './TeaserListing';
import { CSSTransition } from 'react-transition-group';
import withVideos from '../containers/withVideos';
import Fade from '@material-ui/core/Fade';


const propertySelection = (({ top, right, bottom, left, width, height }) => ({ top, right, bottom, left, width, height }))

type Props = {
    setTeaserListingState: Function,
    setActiveVideo: Function,
    teaserListingActive: boolean,
    activeVideo?: Object,
    videos: Function,
    videosLoading: boolean,
    videosError?: Error,
    videosResult: any,
};

class VideoListing extends Component<Props> {
    props: Props;
    constructor() {
        super()
        this.state = {
            activeTeaserVideoIndex: undefined,
            enteredTeaser: false,
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.searchString !== nextProps.searchString) {
            // TODO: may need to move into componentDidUpdate if props have not propogated to container withVideos
            this.props.videos.refetch()
        }
    }
    render() {
        const { videos, videosLoading, teaserListingActive, activeVideo, setActiveVideo, setTeaserListingState } = this.props
        const rowCount = videos.videos ? Math.ceil(videos.videos.length / 3) : 0
        if (videosLoading)
            return null
        return (
            <div className="VideoListing">
                <AutoSizer disableHeight>
                    {({ width }) => (
                        <ColumnSizer
                            width={width}
                            columnMaxWidth={window.innerWidth / 3}
                            columnMinWidth={0}
                            columnCount={3}
                            key="GridColumnSizer"
                        >
                            {({ adjustedWidth, columnWidth, registerChild }) => (
                                <Grid
                                    ref={ref => this._grid = ref}
                                    cellRenderer={this._renderCell}
                                    columnCount={3}
                                    columnWidth={columnWidth}
                                    width={adjustedWidth}
                                    rowCount={rowCount}
                                    rowHeight={adjustedWidth / 3}
                                    height={adjustedWidth / 3 * rowCount + 200}
                                    style={{ marginTop: 200, marginBottom: 200 }}
                                />
                            )}
                        </ColumnSizer>
                    )}
                </AutoSizer>
                <CSSTransition
                    in={teaserListingActive}
                    timeout={450}
                    classNames="teaser-modal"
                    unmountOnExit
                    onExited={this._unsetActiveTeaserVideo}
                    onEntered={this._onEnteredTeaserListing}
                >
                    <div className="teaser-modal">
                        <div className="teaser-modal-backdrop"></div>
                        <TeaserListing
                            videos={videos.videos}
                            activeTeaserVideoIndex={this.state.activeTeaserVideoIndex}
                            activeTeaserVideoCellPosition={this.state.activeTeaserVideoCellPosition}
                            activeFullscreenVideo={this.props.activeVideo}
                            updateActiveVideoIndex={this._setActiveTeaserVideoIndex}
                            enteredTeaser={this.state.enteredTeaser}
                        />
                        <nav className="video-navigation">
                            <Button varient="contained" onClick={() => setTeaserListingState({ isActive: false })}>
                                <ArrowBackIcon />
                                <Typography variant="body1">{`back to browse`}</Typography>
                            </Button>
                        </nav>
                    </div>
                </CSSTransition>
                <CSSTransition
                    in={activeVideo !== undefined}
                    timeout={450}
                    classNames="playback-modal"
                    unmountOnExit
                >
                    <div className="playback-modal">
                        <div className="playback-modal-backdrop"></div>
                        <nav className="video-navigation">
                            <Button varient="contained" onClick={() => setActiveVideo(undefined)}>
                                <ArrowBackIcon />
                                <Typography variant="body1">{`back to info`}</Typography>
                            </Button>
                        </nav>
                    </div>
                </CSSTransition>
            </div>
        );
    }
    _renderCell = ({ columnIndex, key, rowIndex, style }) => {
        const videoIndex = rowIndex * 3 + columnIndex
        const video = this.props.videos.videos[videoIndex]
        const isActive = this.state.activeTeaserVideoIndex === videoIndex
        return video ? (
            <div className="Cell" key={key} style={{ ...style, opacity: isActive ? 0 : 1 }}>
                <VideoListingCellCard 
                    video={video}
                    className="clickable"
                    onClick={this._enterTeaserListingAtVideo.bind(this, videoIndex)} 
                />
            </div>
        ) : null;
    }
    _enterTeaserListingAtVideo = (videoIndex, event) => {
        const activeTeaserVideoCellPosition = propertySelection(event.currentTarget.getBoundingClientRect())
        this.props.setTeaserListingState({ isActive: true })
        this.setState({
            activeTeaserVideoIndex: videoIndex,
            activeTeaserVideoCellPosition,
        })
        // Disable scrolling 
        document.querySelector('.BrowseView').style.overflow = 'hidden'
    }
    _setActiveTeaserVideoIndex = (videoIndex) => {
        const targetCell = document.querySelectorAll('.VideoListing .Cell')[videoIndex]
        if (!targetCell)
            return console.warn(`Could not find .Cell in VideoListing at index ${videoIndex}`)
        const targetCellClickable = targetCell.querySelector('.clickable')
        const activeTeaserVideoCellPosition = propertySelection(targetCellClickable.getBoundingClientRect())
        this.setState({
            activeTeaserVideoIndex: videoIndex,
            activeTeaserVideoCellPosition
        })
    }
    _unsetActiveTeaserVideo = () => {
        this.setState({
            activeTeaserVideoIndex: undefined,
            activeTeaserVideoCellPosition: undefined,
            enteredTeaser: false
        })
        // Enable scrolling 
        document.querySelector('.BrowseView').style.overflow = 'auto'
    }
    _onEnteredTeaserListing = () => {
        this.setState({ enteredTeaser: true })
    }
}

class VideoListingCellCard extends Component {
    constructor() {
        super()
        this.state = {
            imageLoaded: false
        }
    }
    render() {
        const { video, ...props } = this.props
        return (
            <Fade in={this.state.imageLoaded}>
                <div {...props}>
                    <img
                        src={`${window.AO_CORE_URL}/${video.featuredImageUrl}`}
                        onLoad={() => this.setState({imageLoaded: true})}
                        onError={() => this.setState({imageLoaded: true})}
                        style={{position: 'absolute', visibility: 'hidden'}}
                    />                
                    <ButtonBase
                        className="cover-image"
                        style={{ backgroundImage: `url(${window.AO_CORE_URL}/${video.featuredImageUrl})` }}
                    ></ButtonBase>                
                    <Typography variant="subheading">
                        {video.title}
                    </Typography>
                </div>
            </Fade>
        )
    }
}

export default withVideos(VideoListing)