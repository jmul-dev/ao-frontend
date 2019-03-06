import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import BigNumber from "bignumber.js";
import Typography from "@material-ui/core/Typography";
import { TokenBalance } from "../../../utils/denominations";
import DatStats from "../../content/components/DatStats";

const styles = ({ palette }) => ({
    root: {
        display: "flex",
        "& > div + div": {
            marginLeft: 40
        }
    },
    statLabel: {
        letterSpacing: "0.5px",
        fontSize: `0.8125rem`
    },
    stat: {
        color: `#777777`,
        fontSize: `0.8125rem`,
        fontFamily: "courier",
        lineHeight: `0.8125rem`
    },
    multiplier: {
        color: palette.primary.main,
        marginLeft: 4
    }
});

class UserContentStats extends PureComponent {
    static propTypes = {
        video: PropTypes.object.isRequired,
        metrics: PropTypes.shape({
            networkTokenStaked: PropTypes.instanceOf(BigNumber),
            primordialTokenStaked: PropTypes.instanceOf(BigNumber),
            primordialTokenStakedWeight: PropTypes.instanceOf(BigNumber),
            totalStakeEarning: PropTypes.instanceOf(BigNumber),
            totalHostEarning: PropTypes.instanceOf(BigNumber),
            totalFoundationEarning: PropTypes.instanceOf(BigNumber)
        }).isRequired,
        contentHostEarnings: PropTypes.instanceOf(BigNumber).isRequired,
        peerConnectionSpeed: PropTypes.oneOf(["upload", "download"]).isRequired,
        align: PropTypes.oneOf(["left", "right"]),
        // withStyles
        classes: PropTypes.object.isRequired
    };
    render() {
        const {
            classes,
            video,
            metrics,
            contentHostEarnings,
            align,
            peerConnectionSpeed
        } = this.props;
        const transactions = video.transactions || {};
        return (
            <div
                className={classes.root}
                style={{
                    justifyContent:
                        align === "right" ? "flex-end" : "flex-start"
                }}
            >
                <div>
                    <Typography
                        className={classes.statLabel}
                        variant="body1"
                        gutterBottom
                        color="textSecondary"
                        component="div"
                    >
                        {"peers"}
                    </Typography>
                    <Typography
                        className={classes.stat}
                        variant="body2"
                        color="textSecondary"
                        component="div"
                    >
                        <DatStats
                            renderPeerCount
                            stats={[video.metadataDatStats, video.fileDatStats]}
                        />
                    </Typography>
                </div>
                {/* A: This is current user's staked/uploaded content, earnings come from both stake profits and hosting */}
                {transactions.stakeTx && (
                    <div>
                        <Typography
                            className={classes.statLabel}
                            variant="body1"
                            gutterBottom
                            color="textSecondary"
                            component="div"
                        >
                            {"earnings"}
                        </Typography>
                        <Typography
                            className={classes.stat}
                            variant="body2"
                            color="textSecondary"
                            component="div"
                        >
                            <TokenBalance
                                baseAmount={metrics.totalStakeEarning.plus(
                                    contentHostEarnings
                                )}
                                includeAO={true}
                            />
                        </Typography>
                    </div>
                )}
                {/* B: This is hosted/download content, earnings come only from hosting */}
                {transactions.hostTx && (
                    <div>
                        <Typography
                            className={classes.statLabel}
                            variant="body1"
                            gutterBottom
                            color="textSecondary"
                            component="div"
                        >
                            {"earnings"}
                        </Typography>
                        <Typography
                            className={classes.stat}
                            variant="body2"
                            color="textSecondary"
                            component="div"
                        >
                            <TokenBalance
                                baseAmount={contentHostEarnings}
                                includeAO={true}
                            />
                        </Typography>
                    </div>
                )}
                {metrics ? (
                    <div>
                        <Typography
                            className={classes.statLabel}
                            variant="body1"
                            gutterBottom
                            color="textSecondary"
                            component="div"
                        >
                            {"stake"}
                        </Typography>
                        <Typography
                            className={classes.stat}
                            variant="body2"
                            color="textSecondary"
                            component="div"
                        >
                            {metrics.networkTokenStaked.gt(0) ? (
                                <div>
                                    <TokenBalance
                                        baseAmount={metrics.networkTokenStaked}
                                        includeAO={true}
                                        isPrimordial={false}
                                    />
                                </div>
                            ) : null}
                            {metrics.primordialTokenStaked.gt(0) ? (
                                <div style={{ lineHeight: `0.4rem` }}>
                                    <TokenBalance
                                        baseAmount={
                                            metrics.primordialTokenStaked
                                        }
                                        includeAO={true}
                                        isPrimordial={true}
                                    />
                                    <sup className={classes.multiplier}>
                                        x
                                        {metrics.primordialTokenStakedWeight.gte(
                                            10
                                        )
                                            ? metrics.primordialTokenStakedWeight.toFixed(
                                                  1
                                              )
                                            : metrics.primordialTokenStakedWeight.toFixed(
                                                  2
                                              )}
                                    </sup>
                                </div>
                            ) : null}
                        </Typography>
                    </div>
                ) : null}
                {peerConnectionSpeed === "download" && (
                    <div>
                        <Typography
                            className={classes.statLabel}
                            variant="body1"
                            gutterBottom
                            color="textSecondary"
                            component="div"
                        >
                            {"download speed"}
                        </Typography>
                        <Typography
                            className={classes.stat}
                            variant="body2"
                            color="textSecondary"
                            component="div"
                        >
                            <DatStats
                                renderDownloadSpeed
                                stats={[
                                    video.metadataDatStats,
                                    video.fileDatStats
                                ]}
                            />
                        </Typography>
                    </div>
                )}
                {peerConnectionSpeed === "upload" && (
                    <div>
                        <Typography
                            className={classes.statLabel}
                            variant="body1"
                            gutterBottom
                            color="textSecondary"
                            component="div"
                        >
                            {"upload speed"}
                        </Typography>
                        <Typography
                            className={classes.stat}
                            variant="body2"
                            color="textSecondary"
                            component="div"
                        >
                            <DatStats
                                renderUploadSpeed
                                stats={[
                                    video.metadataDatStats,
                                    video.fileDatStats
                                ]}
                            />
                        </Typography>
                    </div>
                )}
            </div>
        );
    }
}
export default withStyles(styles)(UserContentStats);
