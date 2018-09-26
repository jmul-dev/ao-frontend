import React, { Component, Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import withContentMetrics from '../containers/withContentMetrics';
import moment from 'moment';
import Collapse from '@material-ui/core/Collapse';
import { TokenBalance, FileSize } from '../../../utils/denominations';
import PropTypes from 'prop-types';
import { ContentPurchaseAction, ContentPurchaseState } from '../../video/components/ContentPurchaseActions';
import DatStats from '../../content/components/DatStats';
import EtherscanLink from '../../etherscan/EtherscanLink';
import BigNumber from "bignumber.js";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


class AccountVideoListItem extends Component {
    static propTypes = {
        video: PropTypes.object.isRequired,
        filter: PropTypes.oneOf(['downloaded', 'uploaded']),
        metrics: PropTypes.shape({
            networkTokenStaked: PropTypes.instanceOf(BigNumber),
            primordialTokenStaked: PropTypes.instanceOf(BigNumber),
            primordialTokenStakedWeight: PropTypes.instanceOf(BigNumber),
            totalStakeEarning: PropTypes.instanceOf(BigNumber),
            totalHostEarning: PropTypes.instanceOf(BigNumber),
            totalFoundationEarning: PropTypes.instanceOf(BigNumber),
        }),
        getContentMetrics: PropTypes.func.isRequired,
    }
    _watchNowRef;
    constructor() {
        super()
        this.state = {
            expanded: false,
            purchaseReceipt: null,
            tabIndex: 0,
        }
    }
    componentDidMount() {
        if (this.props.video.stakeId) {
            this.props.getContentMetrics(this.props.video.stakeId)
        }
    }
    _toggleExapansion = () => {
        this.setState({ expanded: !this.state.expanded })
    }
    _setTabIndex = (event, value) => {
        this.setState({ tabIndex: value })
        if (value === 1 && !this.state.purchaseReceipt) {
            this._getPurchaseReceipt()
        }
    }
    _getPurchaseReceipt = () => {
        this.props.getPurchaseReceipt(this.props.video.purchaseId).then(result => {
            this.setState({ purchaseReceipt: result })
        })
    }
    _renderContentMetrics = () => {
        const { metrics } = this.props
        return (
            <div className="content-metrics">
                {metrics.primordialTokenStaked.gt(0) ? (
                    <div>
                        <TokenBalance baseAmount={metrics.primordialTokenStaked} includeAO={true} />{' staked'}
                    </div>
                ) : null}
                {metrics.primordialTokenStaked.gt(0) ? (
                    <div>
                        <TokenBalance baseAmount={metrics.networkTokenStaked} includeAO={false} />{' staked'}
                    </div>
                ) : null}
                <div>
                    <TokenBalance baseAmount={metrics.totalStakeEarning.plus(metrics.totalHostEarning)} includeAO={false} />{' earned'}
                </div>
            </div>
        )
    }
    render() {
        const { video, filter, metrics } = this.props
        const transactions = video.transactions || {}
        return (
            <div className="AccountVideoListItem">
                <Grid container spacing={16}>
                    <Grid item sm={4}>
                        <ContentPurchaseAction contentRef={this._watchNowRef} content={video}>{({ action, actionCopy, loading }) => (
                            <ButtonBase className="action-button" disabled={!action || loading} onClick={action}>
                                <div ref={ref => this._watchNowRef = ref} className="featured-image" style={{ backgroundImage: `url(${window.AO_CORE_URL}/${video.featuredImageUrl})` }}>
                                    <ContentPurchaseState content={video} />
                                </div>
                            </ButtonBase>
                        )}</ContentPurchaseAction>
                    </Grid>
                    <Grid item sm={8} className="card-container">
                        <Typography variant="display3" gutterBottom>
                            {video.title}
                        </Typography>
                        <Typography variant="body1" gutterBottom color="textSecondary">
                            {`uploaded: ${moment(parseInt(video.createdAt, 10)).format('M/D/YYYY')}`}
                        </Typography>
                        <DatStats stats={[video.metadataDatStats, video.fileDatStats]} />
                        <Typography variant="body1" gutterBottom color="textSecondary">
                            {video.stakeId && metrics ? this._renderContentMetrics() : (
                                <Fragment>
                                    {!video.stakeId ? `Video has not been staked!` : `Video staked, fetching metrics...`}
                                </Fragment>
                            )}
                        </Typography>
                        <Typography className="txs" variant="body1" gutterBottom color="textSecondary">
                            {transactions.stakeTx ? (
                                <EtherscanLink type={'tx'} value={transactions.stakeTx}>{`Stake Tx`}</EtherscanLink>
                            ) : null}
                            {transactions.hostTx ? (
                                <EtherscanLink type={'tx'} value={transactions.hostTx}>{`Host Tx`}</EtherscanLink>
                            ) : null}
                            {transactions.purchaseTx ? (
                                <EtherscanLink type={'tx'} value={transactions.purchaseTx}>{`Purchase Tx`}</EtherscanLink>
                            ) : null}
                        </Typography>
                    </Grid>
                </Grid>
                <div>
                    <Collapse in={this.state.expanded}>
                        <div className="expansion-container">
                            <Tabs
                                value={this.state.tabIndex}
                                onChange={this._setTabIndex}
                                indicatorColor="primary"
                                textColor="primary"
                                fullWidth
                            >
                                <Tab label="General" />
                                <Tab label="Purchase" />
                                <Tab label="Hosting" />
                                <Tab label="Earnings" />
                            </Tabs>
                            <div style={{ paddingTop: 16 }}>{this._renderTabData()}</div>
                        </div>
                    </Collapse>
                    <ButtonBase className="more-info" onClick={this._toggleExapansion}>
                        {this.state.expanded ? '- hide info' : '+ more info'}
                    </ButtonBase>
                </div>
            </div>
        )
    }
    _renderTabData() {
        const { video } = this.props
        const { tabIndex } = this.state
        switch (tabIndex) {
            case 0:
                return (
                    <div>
                        <Typography className="description" variant="body1" gutterBottom color="textSecondary">
                            {video.description}
                        </Typography>
                        <Typography variant="body1" gutterBottom color="textSecondary">
                            {`Content dat key: dat://${video.fileDatKey}`}
                        </Typography>
                        <Typography variant="body1" gutterBottom color="textSecondary">
                            {`Metadata dat key: dat://${video.metadataDatKey}`}
                        </Typography>
                        <Typography variant="body1" gutterBottom color="textSecondary">
                            {`File size: `}<FileSize sizeInBytes={video.fileSize} />
                        </Typography>
                    </div>
                )
            case 1:
                return (
                    <div>
                        {this.state.purchaseReceipt ? (
                            <Typography variant="body1" component="pre">
                                Purchase receipt:
                                {JSON.stringify(this.state.purchaseReceipt, null, '\t')}
                            </Typography>
                        ) : null}
                        <Typography component="pre">
                            {JSON.stringify(video, null, '\t')}
                        </Typography>
                    </div>
                )
            default:
                return null
        }
    }
}

export const AccountVideoListItemPlaceholder = () => (
    <div className="AccountVideoListItem placeholder">
        <Grid container spacing={16}>
            <Grid item sm={4}>
                <div className="featured-image placeholder-bg"></div>
            </Grid>
            <Grid item sm={8} className="card-container">
                <Typography className="placeholder-text" variant="display3" gutterBottom>
                    {'Lorem ipsum dolor'}
                </Typography>
                <Typography className="placeholder-text" variant="body1" gutterBottom color="textSecondary">
                    {`uploaded: 1/1/1970`}
                </Typography>
                <Typography className="placeholder-text" variant="body1" gutterBottom color="textSecondary">
                    {`X ao earned | X ao staked`}
                </Typography>
                <Typography className="placeholder-text description" variant="body1" gutterBottom color="textSecondary">
                    {'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
                </Typography>
            </Grid>
        </Grid>
    </div>
)

export default withContentMetrics(AccountVideoListItem)