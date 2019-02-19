import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import ReactPlayer from "react-player";
import { CSSTransition } from "react-transition-group";
import { PrimaryButton } from "../../../theme";
import { TokenBalance } from "../../../utils/denominations";
import DatStats from "../../content/components/DatStats";
import ExchangeModal from "../../exchange/components/ExchangeModal";
import withUserContent from "../containers/withUserContent";
import "../styles/teaser-card.css";
import {
    ContentPurchaseAction,
    ContentPurchaseState
} from "./ContentPurchaseActions";
import moment from "moment";
import ClockIcon from "@material-ui/icons/Schedule";
import PeerIcon from "@material-ui/icons/People";
import InfoIcon from "@material-ui/icons/InfoOutline";
import BigNumber from "bignumber.js";
import AccountRequired from "../../account/components/AccountRequired";
import Tooltip from "@material-ui/core/Tooltip";

type Props = {
    contentId: String,
    video: Object,
    isActive: boolean,
    isFullscreen: boolean,
    isTeaserEntered: boolean,
    // redux bound state
    networkTokenBalance: Object, // bignumber
    ethAddress: string,
    // redux bound methods
    setActiveVideo: Function,
    getContentMetrics: Function,
    // graphql props
    userContentQuery: {
        video: Object,
        refetch: Function,
        loading: boolean
    }
};

class TeaserCard extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            videoSrc: props.video.teaserUrl,
            usingTeaserSrc: true,
            videoSrcReady: false,
            exchangeModalOpen: false,
            contentPrice: new BigNumber(
                props.video.contentLicense === "AO" ? props.video.stake : 0
            ),
            contentPriceError: undefined
        };
    }
    componentDidMount() {
        if (this.props.video.lastSeenContentHost) {
            this.props
                .getContentPrice(
                    this.props.video.lastSeenContentHost.contentHostId
                )
                .then(contentPrice => {
                    this.setState({ contentPrice });
                })
                .catch(error => {
                    this.setState({
                        contentPriceError: `Error fetching latest content price: ${
                            error.message
                        }`
                    });
                });
        }
    }
    _onExchangeModalClose = () => {
        this.setState({ exchangeModalOpen: false });
    };
    _playVideo = () => {
        const {
            setActiveVideo,
            networkTokenBalance,
            video,
            userContentQuery
        } = this.props;
        const { contentPrice } = this.state;
        if (!userContentQuery.userContent)
            return console.warn(
                "attempted playing video before video state was fetched"
            );
        if (
            userContentQuery.userContent.state === "STAKED" ||
            userContentQuery.userContent.state === "DISCOVERABLE"
        ) {
            // A: Video is in a playable state
            setActiveVideo(this.props.video);
        } else if (userContentQuery.userContent.state === "DISCOVERED") {
            // B: Content has not began the purchase process
            if (networkTokenBalance.lt(contentPrice)) {
                // B.1: Exchange modal if balance sucks
                this.setState({ exchangeModalOpen: true });
            } else {
                // B.2: Begin download (sorry the logic here is outdated, we should never hit this see _renderActionState)
                return null;
            }
        } else {
            // C: Content is going through the purchase process
            return null;
        }
    };
    _onEnteredFullscreen = () => {
        const { userContentQuery } = this.props;
        if (userContentQuery && userContentQuery.userContent) {
            this.setState({
                videoSrc: userContentQuery.userContent.fileUrl,
                usingTeaserSrc: false
            });
        }
    };
    _onVideoSrcReady = () => {
        this.setState({
            videoSrcReady: true
        });
    };
    _openExchangeModal = () => {
        this.setState({ exchangeModalOpen: true });
    };
    _onExitingFullscreen = () => {};
    _renderActionState = () => {
        const {
            video,
            userContentQuery,
            networkTokenBalance,
            ethAddress
        } = this.props;
        const { contentPrice } = this.state;
        const insufficientBalance = networkTokenBalance.lt(contentPrice)
            ? networkTokenBalance
                  .minus(contentPrice)
                  .multipliedBy(-1)
                  .toNumber()
            : undefined;
        let contentState = "DISCOVERED";
        let content = video;
        const videoQueryLoading = userContentQuery.loading;
        if (userContentQuery.userContent) {
            contentState = userContentQuery.userContent.state;
            content = userContentQuery.userContent;
        }
        if (insufficientBalance) {
            return (
                <PrimaryButton onClick={this._openExchangeModal}>
                    <ContentPurchaseState
                        content={content}
                        currentUserEthAddress={ethAddress}
                    />
                </PrimaryButton>
            );
        } else if (contentState === "DISCOVERABLE") {
            // User has completed the purchase/host/discovery process, they can now play the video
            return (
                <PrimaryButton
                    onClick={this._playVideo}
                    className="play-button"
                >
                    <ContentPurchaseState
                        content={content}
                        currentUserEthAddress={ethAddress}
                    />
                </PrimaryButton>
            );
        } else {
            return (
                <ContentPurchaseAction
                    currentUserEthAddress={ethAddress}
                    contentRef={this.refs.videoContainer}
                    content={content}
                >
                    {({ action, loading, error }) => (
                        <PrimaryButton
                            disabled={!action || loading || videoQueryLoading}
                            onClick={() => {
                                this._handleActionAndUpdateVideoQuery(action);
                            }}
                        >
                            <ContentPurchaseState
                                content={content}
                                currentUserEthAddress={ethAddress}
                            />
                        </PrimaryButton>
                    )}
                </ContentPurchaseAction>
            );
        }
    };
    _handleActionAndUpdateVideoQuery = action => {
        action();
        this.props.userContentQuery
            .refetch()
            .then(data => {
                console.log(`refetched:`, data);
            })
            .catch(error => {
                console.error(`refetch error:`, error);
            });
    };
    _renderLastSeen() {
        const { video, userContentQuery } = this.props;
        if (
            userContentQuery.userContent &&
            userContentQuery.userContent.state === "DISCOVERABLE"
        )
            return null; // user already owns this content
        if (!video.lastSeenContentHost) return null;
        if (video.recentlySeenHostsCount > 0) {
            return (
                <Typography
                    color="primary"
                    variant="body1"
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <PeerIcon style={{ marginRight: 4 }} />{" "}
                    {`${video.recentlySeenHostsCount} recently seen hosts`}
                </Typography>
            );
        }
        const lastSeenDate = moment.utc(
            parseInt(video.lastSeenContentHost.timestamp, 10)
        );
        const likelyAvailableDate = moment().subtract(10, "minutes");
        const potentiallyAvailableDate = moment().subtract(20, "minutes");
        let accentColor = "inherit";
        if (lastSeenDate.isAfter(likelyAvailableDate)) {
            accentColor = "primary";
        } else if (lastSeenDate.isAfter(potentiallyAvailableDate)) {
            accentColor = "secondary";
        } else {
            accentColor = "error";
        }
        return (
            <Typography
                color={accentColor}
                variant="body1"
                style={{ display: "flex", alignItems: "center" }}
            >
                <ClockIcon style={{ marginRight: 4 }} />{" "}
                {`last host seen ${lastSeenDate.fromNow()}`}
            </Typography>
        );
    }
    render() {
        const {
            video,
            userContentQuery,
            isActive,
            isFullscreen,
            isTeaserEntered,
            networkTokenBalance,
            contentMetrics
        } = this.props;
        const { videoSrc, usingTeaserSrc, contentPrice } = this.state;
        const insufficientBalance = networkTokenBalance.lt(contentPrice)
            ? networkTokenBalance
                  .minus(contentPrice)
                  .multipliedBy(-1)
                  .toNumber()
            : undefined;
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
                                key={
                                    usingTeaserSrc
                                        ? "teaser"
                                        : "video" /* Unmounts on src change. TODO: factor fullscreen video into VideoPlayback component */
                                }
                                url={`${
                                    process.env.REACT_APP_AO_CORE_URL
                                }/${videoSrc}`}
                                config={{
                                    file: {
                                        attributes: {
                                            poster: `${
                                                process.env
                                                    .REACT_APP_AO_CORE_URL
                                            }/${video.featuredImageUrl}`,
                                            controlsList: "nodownload"
                                        }
                                    }
                                }}
                                playing={isTeaserEntered && isActive}
                                width="100%"
                                height="100%"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    zIndex: 1
                                }}
                                onReady={
                                    usingTeaserSrc
                                        ? undefined
                                        : this._onVideoSrcReady
                                }
                                onPlay={
                                    usingTeaserSrc
                                        ? undefined
                                        : this._onVideoSrcReady
                                }
                                loop={usingTeaserSrc}
                                controls={!usingTeaserSrc}
                            />
                        </div>
                        <Typography variant="subheading" className="title">
                            {video.title}
                        </Typography>
                        <div className="action-pane hide-fullscreen">
                            <Typography variant="body1">
                                {video.contentLicense === "AO" ? (
                                    <React.Fragment>
                                        <TokenBalance
                                            baseAmount={contentPrice}
                                        />
                                    </React.Fragment>
                                ) : (
                                    <Tooltip
                                        title={`This content is covered under the ${
                                            video.contentLicense
                                        } license`}
                                        placement="left"
                                    >
                                        <span style={{ pointerEvents: "all" }}>
                                            <TokenBalance baseAmount={0} />
                                            <InfoIcon
                                                style={{
                                                    marginLeft: 4,
                                                    fontSize: 16,
                                                    verticalAlign: "sub"
                                                }}
                                            />
                                        </span>
                                    </Tooltip>
                                )}
                            </Typography>
                            <Typography variant="caption" gutterBottom>
                                {`your balance: `}
                                <TokenBalance
                                    baseAmount={networkTokenBalance}
                                    isPrimordial={false}
                                />
                            </Typography>
                            {this._renderLastSeen()}
                            <AccountRequired>
                                {this._renderActionState()}
                            </AccountRequired>
                            {userContentQuery.userContent ? (
                                <div style={{ marginTop: 8 }}>
                                    <DatStats
                                        stats={[
                                            userContentQuery.userContent
                                                .metadataDatStats,
                                            userContentQuery.userContent
                                                .fileDatStats
                                        ]}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="content-container hide-fullscreen">
                        <Grid
                            container
                            spacing={16}
                            alignItems="flex-start"
                            justify="flex-end"
                            style={{ height: 800 }}
                        >
                            <Grid item xs={6}>
                                <Typography variant="body1" component="div">
                                    {video.contentAttribution && (
                                        <div
                                            style={{ marginBottom: 8 }}
                                        >{`Attribution: ${
                                            video.contentAttribution
                                        }`}</div>
                                    )}
                                    {video.description}
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                    {insufficientBalance ? (
                        <ExchangeModal
                            open={this.state.exchangeModalOpen}
                            onClose={this._onExchangeModalClose}
                            exchangeType="network"
                            exchangeProps={{
                                title: "You have insufficient funds",
                                subtitle:
                                    "Purchase more ao to continue streaming.",
                                requiredTokenAmount: insufficientBalance,
                                requiredTokenCopy: "Video cost:"
                            }}
                        />
                    ) : null}
                </div>
            </CSSTransition>
        );
    }
}

export default withUserContent(TeaserCard);
