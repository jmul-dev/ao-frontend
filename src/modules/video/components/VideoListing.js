// @flow
import React, { Component } from "react";
import { AutoSizer, ColumnSizer, Grid } from "react-virtualized";
import "react-virtualized/styles.css";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Typography from "@material-ui/core/Typography";
import "../styles/video-listing.css";
import TeaserListing from "./TeaserListing";
import { CSSTransition } from "react-transition-group";
import withVideos from "../containers/withVideos";
import Fade from "@material-ui/core/Fade";
import OfflineIcon from "@material-ui/icons/CloudOff";
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";

const propertySelection = ({ top, right, bottom, left, width, height }) => ({
    top,
    right,
    bottom,
    left,
    width,
    height
});

type Props = {
    setTeaserListingState: Function,
    setActiveVideo: Function,
    teaserListingActive: boolean,
    activeVideo?: Object,
    videos: Function,
    videosLoading: boolean,
    videosError?: Error
};

class VideoListing extends Component<Props> {
    props: Props;
    constructor() {
        super();
        this.state = {
            activeTeaserVideoIndex: undefined,
            enteredTeaser: false
        };
        this._boundEscKeyListener = this._exitFullscreenEscKeyListener.bind(
            this
        );
    }
    componentDidMount() {
        document.addEventListener("keydown", this._boundEscKeyListener, false);
    }
    componentWillUnmount() {
        document.removeEventListener(
            "keydown",
            this._boundEscKeyListener,
            false
        );
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.searchString !== nextProps.searchString) {
            // TODO: may need to move into componentDidUpdate if props have not propogated to container withVideos
            this.props.videosQuery.refetch();
        }
    }
    _exitFullscreenEscKeyListener = event => {
        const {
            activeVideo,
            teaserListingActive,
            setActiveVideo,
            setTeaserListingState
        } = this.props;
        if (event.keyCode === 27) {
            // esc
            if (activeVideo) setActiveVideo();
            else if (teaserListingActive)
                setTeaserListingState({ isActive: false });
        }
    };
    // Used when there are no videos
    _renderPlaceholderView() {
        return (
            <div className="VideoListing placeholder">
                <Typography
                    className="placeholder-title shimmer"
                    variant="display1"
                >{`Welcome to AO`}</Typography>
                <Typography
                    className="placeholder-description"
                    variant="body1"
                >{`Content will begin to show up here as it is discovered within the AO network`}</Typography>
            </div>
        );
    }
    render() {
        const {
            videosQuery,
            videosLoading,
            teaserListingActive,
            activeVideo,
            setActiveVideo,
            setTeaserListingState
        } = this.props;
        const rowCount = videosQuery.networkContent
            ? Math.ceil(videosQuery.networkContent.length / 3)
            : 0;
        if (videosLoading && !videosQuery.networkContent) return null;
        if (
            videosQuery.networkContent &&
            videosQuery.networkContent.length === 0
        )
            return this._renderPlaceholderView();
        return (
            <div className="VideoListing" style={{ height: "100%" }}>
                <AutoSizer>
                    {({ width, height }) => (
                        <ColumnSizer
                            width={width}
                            columnMaxWidth={window.innerWidth / 3}
                            columnMinWidth={0}
                            columnCount={3}
                            key="GridColumnSizer"
                        >
                            {({
                                adjustedWidth,
                                columnWidth,
                                registerChild
                            }) => (
                                <Grid
                                    ref={ref => (this._grid = ref)}
                                    cellRenderer={this._renderCell}
                                    columnCount={3}
                                    columnWidth={columnWidth}
                                    width={adjustedWidth}
                                    rowCount={rowCount}
                                    rowHeight={adjustedWidth / 3}
                                    height={height}
                                    style={{
                                        paddingTop: 200,
                                        paddingBottom: 200
                                    }}
                                    overscanRowCount={5}
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
                        <div className="teaser-modal-backdrop" />
                        <TeaserListing
                            videos={videosQuery.networkContent}
                            activeTeaserVideoIndex={
                                this.state.activeTeaserVideoIndex
                            }
                            activeTeaserVideoCellPosition={
                                this.state.activeTeaserVideoCellPosition
                            }
                            activeFullscreenVideo={this.props.activeVideo}
                            updateActiveVideoIndex={
                                this._setActiveTeaserVideoIndex
                            }
                            enteredTeaser={this.state.enteredTeaser}
                        />
                        <nav className="video-navigation">
                            <Button
                                varient="contained"
                                onClick={() =>
                                    setTeaserListingState({ isActive: false })
                                }
                            >
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
                        <div className="playback-modal-backdrop" />
                        <nav className="video-navigation">
                            <Button
                                varient="contained"
                                onClick={() => setActiveVideo(undefined)}
                            >
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
        const videoIndex = rowIndex * 3 + columnIndex;
        const video = this.props.videosQuery.networkContent[videoIndex];
        const isActive = this.state.activeTeaserVideoIndex === videoIndex;
        return video ? (
            <div
                className={`Cell video-${videoIndex}`}
                key={key}
                style={{ ...style, opacity: isActive ? 0 : 1 }}
            >
                <VideoListingCellCard
                    video={video}
                    className="clickable"
                    onClick={this._enterTeaserListingAtVideo.bind(
                        this,
                        videoIndex
                    )}
                />
            </div>
        ) : null;
    };
    _enterTeaserListingAtVideo = (videoIndex, event) => {
        const activeTeaserVideoCellPosition = propertySelection(
            event.currentTarget.getBoundingClientRect()
        );
        this.props.setTeaserListingState({ isActive: true });
        this.setState({
            activeTeaserVideoIndex: videoIndex,
            activeTeaserVideoCellPosition
        });
        // Disable scrolling
        document.querySelector(".BrowseView").style.overflow = "hidden";
    };
    _setActiveTeaserVideoIndex = videoIndex => {
        const targetCell = document.querySelector(
            `.VideoListing .Cell.video-${videoIndex}`
        );
        if (targetCell) {
            const targetCellClickable = targetCell.querySelector(".clickable");
            const activeTeaserVideoCellPosition = propertySelection(
                targetCellClickable.getBoundingClientRect()
            );
            this.setState({
                activeTeaserVideoIndex: videoIndex,
                activeTeaserVideoCellPosition
            });
        } else {
            console.warn(
                `Could not find .Cell in VideoListing at index ${videoIndex}, only effects animation`
            );
            this.setState({
                activeTeaserVideoIndex: videoIndex
            });
        }
    };
    _unsetActiveTeaserVideo = () => {
        this.setState({
            activeTeaserVideoIndex: undefined,
            activeTeaserVideoCellPosition: undefined,
            enteredTeaser: false
        });
        // Enable scrolling
        document.querySelector(".BrowseView").style.overflow = "auto";
    };
    _onEnteredTeaserListing = () => {
        this.setState({ enteredTeaser: true });
    };
}

class VideoListingCellCard extends Component {
    constructor() {
        super();
        this.state = {
            imageLoaded: false
        };
    }
    render() {
        const { video, ...props } = this.props;
        return (
            <Fade in={this.state.imageLoaded}>
                <div
                    {...props}
                    style={{
                        opacity: video.recentlySeenHostsCount > 0 ? 1 : 0.3
                    }}
                >
                    <img
                        src={`${process.env.REACT_APP_AO_CORE_URL}/${
                            video.featuredImageUrl
                        }`}
                        alt={video.title}
                        onLoad={() => this.setState({ imageLoaded: true })}
                        onError={() => this.setState({ imageLoaded: true })}
                        style={{ position: "absolute", visibility: "hidden" }}
                    />
                    <ButtonBase
                        className="cover-image"
                        style={{
                            backgroundImage: `url(${
                                process.env.REACT_APP_AO_CORE_URL
                            }/${video.featuredImageUrl})`
                        }}
                    />
                    <Typography
                        variant="subheading"
                        style={{ display: "flex" }}
                    >
                        {video.title}
                        {video.recentlySeenHostsCount < 1 && (
                            <Tooltip
                                title={
                                    video.lastSeenContentHost
                                        ? `last host seen ${moment
                                              .utc(
                                                  parseInt(
                                                      video.lastSeenContentHost
                                                          .timestamp,
                                                      10
                                                  )
                                              )
                                              .fromNow()}`
                                        : "Unable to find a host for this piece of content"
                                }
                            >
                                <OfflineIcon style={{ marginLeft: "auto" }} />
                            </Tooltip>
                        )}
                    </Typography>
                </div>
            </Fade>
        );
    }
}

export default withVideos(VideoListing);
