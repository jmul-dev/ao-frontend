import ButtonBase from "@material-ui/core/ButtonBase";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import BigNumber from "bignumber.js";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { compose } from "react-apollo";
import { Link } from "react-router-dom";
import { TokenBalance } from "../../../utils/denominations";
import {
    ContentPurchaseAction,
    ContentPurchaseState,
    getContentState
} from "../../video/components/ContentPurchaseActions";
import withContentMetrics from "../containers/withContentMetrics";
import UserContentStats from "./UserContentStats";
import withUserIdentifiers from "../../account/containers/withUserIdentifiers";

class ContentListItem extends Component {
    static propTypes = {
        listingContentType: PropTypes.string,
        currentUserEthAddress: PropTypes.string.isRequired,
        content: PropTypes.object.isRequired,
        filter: PropTypes.oneOf(["downloaded", "uploaded"]),
        metrics: PropTypes.shape({
            networkTokenStaked: PropTypes.instanceOf(BigNumber),
            primordialTokenStaked: PropTypes.instanceOf(BigNumber),
            primordialTokenStakedWeight: PropTypes.instanceOf(BigNumber),
            totalStakeEarning: PropTypes.instanceOf(BigNumber),
            totalHostEarning: PropTypes.instanceOf(BigNumber),
            totalFoundationEarning: PropTypes.instanceOf(BigNumber)
        }),
        getContentMetrics: PropTypes.func.isRequired,
        getContentHostEarnings: PropTypes.func.isRequired,
        // withStyles
        classes: PropTypes.object.isRequired,
        // withUserIdentifiers
        ethAddress: PropTypes.string.isRequired
    };
    _watchNowRef;
    componentDidMount() {
        if (this.props.content.stakeId) {
            this.props.getContentMetrics(this.props.content.stakeId);
        }
        if (this.props.content.contentHostId) {
            this.props.getContentHostEarnings(this.props.content.contentHostId);
        }
    }
    _renderContentMetrics = () => {
        const { metrics } = this.props;
        return (
            <div className="content-metrics">
                {metrics.primordialTokenStaked.gt(0) ? (
                    <div>
                        <TokenBalance
                            baseAmount={metrics.primordialTokenStaked}
                            includeAO={true}
                        />
                        {" staked"}
                    </div>
                ) : null}
                {metrics.primordialTokenStaked.gt(0) ? (
                    <div>
                        <TokenBalance
                            baseAmount={metrics.networkTokenStaked}
                            includeAO={false}
                        />
                        {" staked"}
                    </div>
                ) : null}
                <div>
                    <TokenBalance
                        baseAmount={metrics.totalStakeEarning.plus(
                            metrics.totalHostEarning
                        )}
                        includeAO={false}
                    />
                    {" earned"}
                </div>
            </div>
        );
    };
    _renderCardState() {
        const {
            content,
            metrics,
            contentHostEarnings,
            classes,
            listingContentType
        } = this.props;
        const { isCompleted, stateCopy, StateIcon } = getContentState(
            content,
            this.props.currentUserEthAddress
        );
        const transactions = content.transactions || {};
        if (isCompleted) {
            return (
                <ButtonBase
                    component={Link}
                    to={{
                        pathname: `/app/view/account/${content.contentType.toLowerCase()}/${
                            content.id
                        }`,
                        state: { listingContentType }
                    }}
                    className={classes.completedCardStateContainer}
                >
                    <Typography variant="subheading">
                        {content.title}
                    </Typography>
                    <Typography
                        variant="caption"
                        className={classes.contentIdCaption}
                    >
                        {content.id}
                    </Typography>
                    <div className={classes.statsContainer}>
                        <UserContentStats
                            video={content}
                            metrics={metrics}
                            peerConnectionSpeed={
                                transactions.purchaseTx && !transactions.hostTx
                                    ? "download"
                                    : "upload"
                            }
                            contentHostEarnings={contentHostEarnings}
                        />
                        <div style={{ marginLeft: "auto", marginRight: 0 }}>
                            <KeyboardArrowRightIcon
                                style={{
                                    width: 32,
                                    height: 32,
                                    color: "#333333"
                                }}
                            />
                        </div>
                    </div>
                </ButtonBase>
            );
        } else {
            return (
                <div className={classes.incompleteCardStateContainer}>
                    <div className={classes.stateIconContainer}>
                        <StateIcon className={classes.stateIcon} />
                    </div>
                    <div>
                        <Typography variant="subheading" component="div">
                            {content.title}
                        </Typography>
                        <Typography variant="caption">{content.id}</Typography>
                        <ContentPurchaseAction
                            contentRef={this._watchNowRef}
                            content={content}
                        >
                            {({ action, actionCopy, loading }) => (
                                <ButtonBase
                                    onClick={action}
                                    disabled={!action || loading}
                                >
                                    <Typography
                                        variant="body1"
                                        gutterBottom
                                        color={
                                            !action || loading
                                                ? "textSecondary"
                                                : "primary"
                                        }
                                    >
                                        {stateCopy || actionCopy}
                                    </Typography>
                                </ButtonBase>
                            )}
                        </ContentPurchaseAction>
                    </div>
                    <ButtonBase
                        component={Link}
                        className={classes.incompleteNavLink}
                        to={{
                            pathname: `/app/view/account/${content.contentType.toLowerCase()}/${
                                content.id
                            }`,
                            state: { listingContentType }
                        }}
                    >
                        <KeyboardArrowRightIcon
                            style={{ width: 32, height: 32, color: "#333333" }}
                        />
                    </ButtonBase>
                </div>
            );
        }
    }
    render() {
        const { content, classes, ethAddress } = this.props;
        const isCompletedState = content.state === "DISCOVERABLE";
        return (
            <Grid className={classes.root} container spacing={16}>
                <Grid item sm={4}>
                    <ContentPurchaseAction
                        contentRef={this._watchNowRef}
                        content={content}
                    >
                        {({ action }) => {
                            // NOTE: only rendering the "play" action on previewImage
                            return (
                                <ButtonBase
                                    className={classes.previewImageButton}
                                    disabled={!isCompletedState}
                                    onClick={action}
                                >
                                    <div
                                        ref={ref => (this._watchNowRef = ref)}
                                        className={classes.previewImage}
                                        style={{
                                            backgroundImage: `url(${
                                                process.env
                                                    .REACT_APP_AO_CORE_URL
                                            }/${content.featuredImageUrl})`,
                                            opacity: isCompletedState ? 1 : 0.15
                                        }}
                                    >
                                        {isCompletedState ? (
                                            <ContentPurchaseState
                                                content={content}
                                                currentUserEthAddress={
                                                    ethAddress
                                                }
                                            />
                                        ) : null}
                                    </div>
                                </ButtonBase>
                            );
                        }}
                    </ContentPurchaseAction>
                </Grid>
                <Grid item sm={8} className={classes.cardStateContainer}>
                    {this._renderCardState()}
                </Grid>
            </Grid>
        );
    }
}

const styles = ({ spacing }) => ({
    root: {
        paddingTop: spacing.unit,
        paddingBottom: spacing.unit
    },
    previewImageButton: {
        width: "100%",
        display: "block"
    },
    previewImage: {
        position: "relative",
        width: "100%",
        paddingBottom: "56.2%",
        background: "#151515",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        "& > div": {
            position: "absolute",
            bottom: 0,
            right: 0,
            padding: spacing.unit,
            background: "rgba(0,0,0,0.5)",
            color: "white"
        }
    },
    cardStateContainer: {},
    completedCardStateContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        height: "100%",
        paddingLeft: spacing.unit * 5
    },
    contentIdCaption: {
        marginBottom: spacing.unit * 2
    },
    statsContainer: {
        width: "100%",
        display: "flex"
        // paddingLeft: 40,
    },
    incompleteCardStateContainer: {
        display: "flex",
        height: "100%",
        alignItems: "center"
    },
    stateIconContainer: {
        marginRight: spacing.unit * 2,
        marginBottom: 26
    },
    stateIcon: {
        width: `24px !important`,
        height: `24px !important`,
        color: "white"
    },
    incompleteNavLink: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        flex: 1,
        marginLeft: 48
    }
});

export default compose(
    withContentMetrics,
    withStyles(styles),
    withUserIdentifiers
)(ContentListItem);

export const ContentListItemPlaceholder = () => (
    <div className="ContentListItem placeholder">
        <Grid container spacing={16}>
            <Grid item sm={4}>
                <div className="featured-image placeholder-bg" />
            </Grid>
            <Grid item sm={8} className="card-container">
                <Typography
                    className="placeholder-text"
                    variant="subheading"
                    gutterBottom
                >
                    {"Lorem ipsum dolor"}
                </Typography>
                <Typography
                    className="placeholder-text"
                    variant="body1"
                    gutterBottom
                    color="textSecondary"
                >
                    {`uploaded: 1/1/1970`}
                </Typography>
                <Typography
                    className="placeholder-text"
                    variant="body1"
                    gutterBottom
                    color="textSecondary"
                >
                    {`X ao earned | X ao staked`}
                </Typography>
                <Typography
                    className="placeholder-text description"
                    variant="body1"
                    gutterBottom
                    color="textSecondary"
                >
                    {
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    }
                </Typography>
            </Grid>
        </Grid>
    </div>
);
