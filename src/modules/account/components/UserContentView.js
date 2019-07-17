import { Typography, Grid, ButtonBase, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PlayIcon from "@material-ui/icons/PlayArrow";
import PropTypes from "prop-types";
import React, { PureComponent, Fragment } from "react";
import { compose } from "react-apollo";
import withContentMetrics from "../containers/withContentMetrics";
import BigNumber from "bignumber.js";
import {
    ContentPurchaseAction,
    ContentPurchaseState
} from "../../video/components/ContentPurchaseActions";
import { PrimaryButton } from "../../../theme";
import UserContentStats from "./UserContentStats";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Divider from "@material-ui/core/Divider";
import { FileSize, TokenBalance } from "../../../utils/denominations";
import EtherscanLink from "../../etherscan/EtherscanLink";
import moment from "moment";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import withUserIdentifiers from "../containers/withUserIdentifiers";
import DeleteIcon from "@material-ui/icons/Delete";

class UserContentView extends PureComponent {
    static propTypes = {
        content: PropTypes.object.isRequired,
        // withStyles
        classes: PropTypes.object.isRequired,
        // withContentMetrics
        metrics: PropTypes.shape({
            networkTokenStaked: PropTypes.instanceOf(BigNumber),
            primordialTokenStaked: PropTypes.instanceOf(BigNumber),
            primordialTokenStakedWeight: PropTypes.instanceOf(BigNumber),
            totalStakeEarning: PropTypes.instanceOf(BigNumber),
            totalHostEarning: PropTypes.instanceOf(BigNumber),
            totalFoundationEarning: PropTypes.instanceOf(BigNumber)
        }),
        contentHostEarnings: PropTypes.instanceOf(BigNumber),
        getContentMetrics: PropTypes.func.isRequired,
        getContentHostEarnings: PropTypes.func.isRequired,
        getPurchaseReceipt: PropTypes.func.isRequired,
        // withUserIdentifiers
        ethAddress: PropTypes.string.isRequired
    };
    _watchNowRef;
    constructor() {
        super();
        this.state = {
            activeTabIndex: 0,
            purchaseReceipt: null
        };
    }
    componentDidMount() {
        const { content } = this.props;
        if (content.stakeId) {
            this.props.getContentMetrics(content.stakeId);
        }
        if (content.contentHostId) {
            this.props.getContentHostEarnings(content.contentHostId);
        }
        if (content.purchaseReceiptId) {
            this.props
                .getPurchaseReceipt(content.purchaseReceiptId)
                .then(result => {
                    this.setState({ purchaseReceipt: result });
                })
                .catch(error => {
                    console.error(`Error getting purchase receipt:`, error);
                });
        }
    }
    _setTabIndex = (event, value) => {
        this.setState({
            activeTabIndex: value
        });
    };
    render() {
        const { activeTabIndex } = this.state;
        const {
            classes,
            content,
            metrics,
            contentHostEarnings,
            ethAddress,
            location
        } = this.props;
        const isCompletedState = content.state === "DISCOVERABLE";
        const transactions = content.transactions || {};
        const accountUserContentListingType = location.state
            ? location.state.listingContentType
            : undefined;
        return (
            <Grid spacing={16} container>
                <Grid item xs={12}>
                    <ButtonBase
                        varient="contained"
                        component={Link}
                        to={`/app/view/account${
                            accountUserContentListingType
                                ? `/${accountUserContentListingType}`
                                : ""
                        }`}
                        className={classes.backNav}
                    >
                        <ArrowBackIcon />
                        <Typography variant="body1">{`back to my content`}</Typography>
                    </ButtonBase>
                </Grid>
                <ContentPurchaseAction
                    contentRef={this._watchNowRef}
                    content={content}
                >
                    {({
                        action,
                        cancelAction,
                        loading,
                        error,
                        downloadProgress
                    }) => (
                        <Fragment>
                            <Grid item sm={12}>
                                <ButtonBase
                                    buttonRef={ref => {
                                        this._watchNowRef = ref;
                                    }}
                                    className={classes.previewImage}
                                    style={{
                                        backgroundImage: `url(${
                                            process.env.REACT_APP_AO_CORE_URL
                                        }/${content.featuredImageUrl})`,
                                        opacity: isCompletedState ? 1 : 0.15
                                    }}
                                    disabled={!isCompletedState || !action}
                                    onClick={action}
                                >
                                    {content.contentType === "VOD" && (
                                        <div>
                                            <PlayIcon />
                                        </div>
                                    )}
                                </ButtonBase>
                            </Grid>
                            <Grid item xs={12} sm={5} md={5} lg={6}>
                                <Typography
                                    className={classes.title}
                                    variant="display3"
                                    gutterBottom
                                >
                                    {content.title}
                                </Typography>
                                <div>
                                    <PrimaryButton
                                        disabled={!action || loading}
                                        onClick={action}
                                    >
                                        <ContentPurchaseState
                                            content={content}
                                            downloadProgress={downloadProgress}
                                            currentUserEthAddress={ethAddress}
                                        />
                                    </PrimaryButton>
                                    {content.state === "DAT_INITIALIZED" && (
                                        <Button
                                            className={classes.deleteButton}
                                            onClick={() => {
                                                cancelAction();
                                                this.props.history.goBack();
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <DeleteIcon
                                                    style={{ marginRight: 8 }}
                                                />
                                                {`delete content`}
                                            </div>
                                        </Button>
                                    )}
                                </div>
                            </Grid>
                        </Fragment>
                    )}
                </ContentPurchaseAction>
                <Grid item xs={12} sm={7} md={7} lg={6}>
                    <UserContentStats
                        video={content}
                        metrics={metrics}
                        contentHostEarnings={contentHostEarnings}
                        align="right"
                        peerConnectionSpeed={
                            transactions.purchaseTx && !transactions.hostTx
                                ? "download"
                                : "upload"
                        }
                    />
                </Grid>
                <Grid item xs={12} className={classes.contentContainer}>
                    <Tabs
                        className={classes.tabs}
                        value={activeTabIndex}
                        onChange={this._setTabIndex}
                        indicatorColor="primary"
                        TabIndicatorProps={{ className: classes.tabIndicator }}
                    >
                        <Tab
                            label="General"
                            classes={{
                                label: classes.tabLabel,
                                labelContainer: classes.tabLabelContainer,
                                wrapper: classes.tabWrapper,
                                root: classes.tabRoot
                            }}
                        />
                        <Tab
                            label="Transactions"
                            classes={{
                                label: classes.tabLabel,
                                labelContainer: classes.tabLabelContainer,
                                wrapper: classes.tabWrapper,
                                root: classes.tabRoot
                            }}
                        />
                        <Tab
                            label="Earnings"
                            classes={{
                                label: classes.tabLabel,
                                labelContainer: classes.tabLabelContainer,
                                wrapper: classes.tabWrapper,
                                root: classes.tabRoot
                            }}
                        />
                        <Tab
                            label="TaoDB"
                            classes={{
                                label: classes.tabLabel,
                                labelContainer: classes.tabLabelContainer,
                                wrapper: classes.tabWrapper,
                                root: classes.tabRoot
                            }}
                        />
                        <Tab
                            label="Advanced"
                            classes={{
                                label: classes.tabLabel,
                                labelContainer: classes.tabLabelContainer,
                                wrapper: classes.tabWrapper,
                                root: classes.tabRoot
                            }}
                        />
                    </Tabs>
                    <Divider />
                    <div className={classes.tabContentContainer}>
                        {activeTabIndex === 0 && (
                            <div>
                                <div className={classes.contentListItem}>
                                    <Typography
                                        className={classes.contentLabel}
                                        variant="caption"
                                    >
                                        {"Date uploaded"}
                                    </Typography>
                                    <Typography
                                        className={classes.content}
                                        variant="body2"
                                    >
                                        {moment(
                                            parseInt(content.createdAt, 10)
                                        ).format("M/D/YYYY")}
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography
                                        className={classes.contentLabel}
                                        variant="caption"
                                    >
                                        {"Content creator"}
                                    </Typography>
                                    <Typography
                                        className={classes.content}
                                        variant="body2"
                                        style={{ whiteSpace: "nowrap" }}
                                    >
                                        {`Eth address: ${
                                            content.creatorEthAddress
                                        }`}
                                        <br />
                                        {`AO public key: ${
                                            content.creatorNodePublicKey
                                        }`}
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography
                                        className={classes.contentLabel}
                                        variant="caption"
                                    >
                                        {"Content license"}
                                    </Typography>
                                    <Typography
                                        className={classes.content}
                                        variant="body2"
                                    >
                                        {content.contentLicense}
                                    </Typography>
                                </div>
                                {content.contentLicense === "TAO" && (
                                    <React.Fragment>
                                        <Divider />
                                        <div
                                            className={classes.contentListItem}
                                        >
                                            <Typography
                                                className={classes.contentLabel}
                                                variant="caption"
                                            >
                                                {"TAO id:"}
                                            </Typography>
                                            <Typography
                                                className={classes.content}
                                                variant="body2"
                                            >
                                                {content.taoId}
                                            </Typography>
                                        </div>
                                    </React.Fragment>
                                )}
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography
                                        className={classes.contentLabel}
                                        variant="caption"
                                    >
                                        {"Description"}
                                    </Typography>
                                    <Typography
                                        className={classes.content}
                                        variant="body2"
                                    >
                                        {content.description}
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography
                                        className={classes.contentLabel}
                                        variant="caption"
                                    >
                                        {"File size"}
                                    </Typography>
                                    <Typography
                                        className={classes.content}
                                        variant="body2"
                                    >
                                        <FileSize
                                            sizeInBytes={content.fileSize}
                                        />
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography
                                        className={classes.contentLabel}
                                        variant="caption"
                                    >
                                        {"Content dat key"}
                                    </Typography>
                                    <Typography
                                        className={classes.content}
                                        variant="body2"
                                    >
                                        {`dat://${content.fileDatKey}`}
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography
                                        className={classes.contentLabel}
                                        variant="caption"
                                    >
                                        {"Metadata dat key"}
                                    </Typography>
                                    <Typography
                                        className={classes.content}
                                        variant="body2"
                                    >
                                        {`dat://${content.metadataDatKey}`}
                                    </Typography>
                                </div>
                                {content.contentType === "DAPP" && (
                                    <React.Fragment>
                                        <Divider />
                                        <div
                                            className={classes.contentListItem}
                                        >
                                            <Typography
                                                className={classes.contentLabel}
                                                variant="caption"
                                            >
                                                {"Dapp index path:"}
                                            </Typography>
                                            <Typography
                                                className={classes.content}
                                                variant="body2"
                                            >
                                                {content.dappIndexPath}
                                            </Typography>
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                        )}
                        {activeTabIndex === 1 && (
                            <div>
                                {transactions.purchaseTx && (
                                    <Fragment>
                                        <div
                                            className={classes.contentListItem}
                                        >
                                            <Typography
                                                className={classes.contentLabel}
                                                variant="caption"
                                            >
                                                {"Purchase tx"}
                                            </Typography>
                                            <Typography
                                                className={classes.content}
                                                variant="body2"
                                            >
                                                <EtherscanLink
                                                    type={"tx"}
                                                    value={
                                                        transactions.purchaseTx
                                                    }
                                                />
                                            </Typography>
                                        </div>
                                        <Divider />
                                    </Fragment>
                                )}
                                {this.state.purchaseReceipt && (
                                    <Fragment>
                                        <div
                                            className={classes.contentListItem}
                                        >
                                            <Typography
                                                className={classes.contentLabel}
                                                variant="caption"
                                            >
                                                {"Purchase receipt"}
                                            </Typography>
                                            <Typography
                                                className={classes.content}
                                                variant="body2"
                                                component="pre"
                                            >
                                                {JSON.stringify(
                                                    this.state.purchaseReceipt,
                                                    null,
                                                    "\t"
                                                )}
                                            </Typography>
                                        </div>
                                        <Divider />
                                    </Fragment>
                                )}
                                {transactions.stakeTx && (
                                    <Fragment>
                                        <div
                                            className={classes.contentListItem}
                                        >
                                            <Typography
                                                className={classes.contentLabel}
                                                variant="caption"
                                            >
                                                {"Stake tx"}
                                            </Typography>
                                            <Typography
                                                className={classes.content}
                                                variant="body2"
                                            >
                                                <EtherscanLink
                                                    type={"tx"}
                                                    value={transactions.stakeTx}
                                                />
                                            </Typography>
                                        </div>
                                        <Divider />
                                    </Fragment>
                                )}
                                {transactions.hostTx && (
                                    <Fragment>
                                        <div
                                            className={classes.contentListItem}
                                        >
                                            <Typography
                                                className={classes.contentLabel}
                                                variant="caption"
                                            >
                                                {"Host tx"}
                                            </Typography>
                                            <Typography
                                                className={classes.content}
                                                variant="body2"
                                            >
                                                <EtherscanLink
                                                    type={"tx"}
                                                    value={transactions.hostTx}
                                                />
                                            </Typography>
                                        </div>
                                    </Fragment>
                                )}
                            </div>
                        )}
                        {activeTabIndex === 2 && metrics && (
                            <div>
                                <div className={classes.contentListItem}>
                                    <Typography
                                        className={classes.contentLabel}
                                        variant="caption"
                                    >
                                        {"Earnings from stake"}
                                    </Typography>
                                    <Typography
                                        className={classes.content}
                                        variant="body2"
                                    >
                                        <TokenBalance
                                            baseAmount={
                                                metrics.totalStakeEarning
                                            }
                                            includeAO={true}
                                        />
                                        <br />
                                        {`Staking profits earned by original content owner.`}
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography
                                        className={classes.contentLabel}
                                        variant="caption"
                                    >
                                        {"Earnings from hosting"}
                                    </Typography>
                                    <Typography
                                        className={classes.content}
                                        variant="body2"
                                    >
                                        <TokenBalance
                                            baseAmount={
                                                metrics.totalHostEarning
                                            }
                                            includeAO={true}
                                        />
                                        <br />
                                        {`Profits earned by all content hosts.`}
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography
                                        className={classes.contentLabel}
                                        variant="caption"
                                    >
                                        {"Contributed towards foundation"}
                                    </Typography>
                                    <Typography
                                        className={classes.content}
                                        variant="body2"
                                    >
                                        <TokenBalance
                                            baseAmount={
                                                metrics.totalFoundationEarning
                                            }
                                            includeAO={true}
                                        />
                                        <br />
                                        {`Contributed towards The AO foundation, used for further development of the platform.`}
                                    </Typography>
                                </div>
                            </div>
                        )}
                        {activeTabIndex === 3 && (
                            <div>
                                {content.taodbValues.map(taodbKeyValue => {
                                    let value = taodbKeyValue.value;
                                    try {
                                        value = JSON.parse(value);
                                    } catch (error) {}
                                    return (
                                        <React.Fragment key={taodbKeyValue.key}>
                                            <div
                                                className={
                                                    classes.contentListItem
                                                }
                                            >
                                                <Typography
                                                    className={
                                                        classes.contentLabel
                                                    }
                                                    variant="caption"
                                                >
                                                    {taodbKeyValue.label}
                                                </Typography>
                                                <Typography
                                                    className={classes.content}
                                                    variant="body2"
                                                    component="pre"
                                                >
                                                    {JSON.stringify(
                                                        {
                                                            schema:
                                                                taodbKeyValue.schema,
                                                            key:
                                                                taodbKeyValue.key,
                                                            value
                                                        },
                                                        null,
                                                        "\t"
                                                    )}
                                                </Typography>
                                            </div>
                                            <Divider />
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        )}
                        {activeTabIndex === 4 && (
                            <div>
                                <div className={classes.contentListItem}>
                                    <Typography
                                        className={classes.contentLabel}
                                        variant="caption"
                                    >
                                        {"Content state"}
                                    </Typography>
                                    <Typography
                                        className={classes.content}
                                        variant="body2"
                                    >
                                        {content.state}
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography
                                        className={classes.contentLabel}
                                        variant="caption"
                                    >
                                        {"Content JSON"}
                                    </Typography>
                                    <Typography
                                        className={classes.content}
                                        variant="body2"
                                        component="pre"
                                    >
                                        {JSON.stringify(content, null, "\t")}
                                    </Typography>
                                </div>
                                <Divider />
                            </div>
                        )}
                    </div>
                </Grid>
            </Grid>
        );
    }
}

const styles = ({ palette, spacing }) => ({
    backNav: {
        position: "absolute",
        color: "white",
        top: 45,
        left: 45
    },
    previewImage: {
        position: "relative",
        width: "100%",
        paddingBottom: "56.2%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        marginBottom: spacing.unit * 3,
        "& > div": {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: spacing.unit * 2,
            background: "rgba(0,0,0,0.5)",
            color: "white"
        }
    },
    title: {
        marginBottom: spacing.unit * 2,
        fontWeight: "bold"
    },
    deleteButton: {
        marginTop: 4,
        borderRadius: 0,
        background: "#333",
        color: "#DDD"
    },
    contentContainer: {
        marginTop: spacing.unit * 4
    },
    contentListItem: {
        display: "flex",
        paddingTop: spacing.unit * 2,
        paddingBottom: spacing.unit * 4
    },
    contentLabel: {
        width: 200,
        paddingRight: spacing.unit * 3,
        paddingTop: 5,
        flexShrink: 0,
        fontWeight: "bold"
    },
    content: {
        color: "#777777",
        overflow: "auto"
    },
    // Tabs
    tabs: {
        marginBottom: spacing.unit * 2
    },
    tabIndicator: {
        display: "none"
    },
    tabContentContainer: {
        minHeight: "80vh"
    },
    // Tab
    tabRoot: {
        minWidth: "initial",
        marginRight: spacing.unit * 3,
        opacity: 0.3
    },
    tabWrapper: {
        alignItems: "flex-start"
    },
    tabLabelContainer: {
        paddingLeft: 0
    },
    tabLabel: {
        fontSize: `1.325rem`,
        color: "white",
        textTransform: "none"
    }
});

export default compose(
    withRouter,
    withStyles(styles),
    withContentMetrics,
    withUserIdentifiers
)(UserContentView);
