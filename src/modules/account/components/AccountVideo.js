import { Typography, Grid, ButtonBase } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { compose } from 'react-apollo';
import withContentMetrics from '../containers/withContentMetrics';
import BigNumber from 'bignumber.js';
import { ContentPurchaseAction, ContentPurchaseState } from '../../video/components/ContentPurchaseActions';
import { PrimaryButton } from '../../../theme';
import AccountVideoStats from './AccountVideoStats';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import { FileSize, TokenBalance } from '../../../utils/denominations';
import EtherscanLink from '../../etherscan/EtherscanLink';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import withEthAddress from '../containers/withEthAddress';


class AccountVideo extends PureComponent {
    static propTypes = {
        video: PropTypes.object.isRequired,
        // withStyles
        classes: PropTypes.object.isRequired,        
        // withContentMetrics
        metrics: PropTypes.shape({
            networkTokenStaked: PropTypes.instanceOf(BigNumber),
            primordialTokenStaked: PropTypes.instanceOf(BigNumber),
            primordialTokenStakedWeight: PropTypes.instanceOf(BigNumber),
            totalStakeEarning: PropTypes.instanceOf(BigNumber),
            totalHostEarning: PropTypes.instanceOf(BigNumber),
            totalFoundationEarning: PropTypes.instanceOf(BigNumber),
        }),
        contentHostEarnings: PropTypes.instanceOf(BigNumber),
        getContentMetrics: PropTypes.func.isRequired,
        getContentHostEarnings: PropTypes.func.isRequired,
        getPurchaseReceipt: PropTypes.func.isRequired,
        // withEthAddress
        ethAddress: PropTypes.string.isRequired,
    }
    _watchNowRef;
    constructor() {
        super()
        this.state = {
            activeTabIndex: 0,
            purchaseReceipt: null,
        }
    }
    componentDidMount() {
        if (this.props.video.stakeId) {
            this.props.getContentMetrics(this.props.video.stakeId)
        }
        if (this.props.video.contentHostId) {
            this.props.getContentHostEarnings(this.props.video.contentHostId)
        }
        if (this.props.video.purchaseId) {
            this.props.getPurchaseReceipt(this.props.video.purchaseId).then(result => {
                this.setState({ purchaseReceipt: result })
            })
        }
    }
    _setTabIndex = (event, value) => {
        this.setState({
            activeTabIndex: value
        })
    }
    render() {
        const { activeTabIndex } = this.state
        const { classes, video, metrics, contentHostEarnings, ethAddress } = this.props
        const isCompletedState = video.state === 'DISCOVERABLE'
        const transactions = video.transactions || {}
        return (
            <Grid spacing={16} container>
                <Grid item xs={12}>
                    <ButtonBase varient="contained" component={Link} to={`/app/view/videos`} className={classes.backNav}>
                        <ArrowBackIcon />
                        <Typography variant="body1">{`back to my videos`}</Typography>
                    </ButtonBase>
                </Grid>
                <ContentPurchaseAction currentUserEthAddress={ethAddress} contentRef={this._watchNowRef} content={video}>{({action, loading, error}) => (
                    <Fragment>
                        <Grid item sm={12}>
                            <ButtonBase
                                buttonRef={ref => {this._watchNowRef = ref}} 
                                className={classes.previewImage} 
                                style={{ backgroundImage: `url(${process.env.REACT_APP_AO_CORE_URL}/${video.featuredImageUrl})`, opacity: isCompletedState ? 1 : 0.15 }}
                                disabled={!isCompletedState}
                                onClick={action}
                                >
                                <div>
                                    <PlayIcon />
                                </div>
                            </ButtonBase>
                        </Grid>
                        <Grid item xs={12} sm={5} md={5} lg={6}>
                            <Typography className={classes.title} variant="display3" gutterBottom>
                                {video.title}
                            </Typography>
                            <PrimaryButton disabled={!action || loading} onClick={action}>
                                <ContentPurchaseState content={video} currentUserEthAddress={ethAddress} />
                            </PrimaryButton>                        
                        </Grid>
                    </Fragment>
                )}</ContentPurchaseAction>
                <Grid item xs={12} sm={7} md={7} lg={6}>
                    <AccountVideoStats 
                        video={video} 
                        metrics={metrics}
                        contentHostEarnings={contentHostEarnings}
                        align="right" 
                        peerConnectionSpeed={transactions.purchaseTx && !transactions.hostTx ? 'download' : 'upload'} 
                    />
                </Grid>
                <Grid item xs={12} className={classes.contentContainer}>
                    <Tabs className={classes.tabs} value={activeTabIndex} onChange={this._setTabIndex} indicatorColor="primary" TabIndicatorProps={{className: classes.tabIndicator}}>
                        <Tab label="General" classes={{label: classes.tabLabel, labelContainer: classes.tabLabelContainer, wrapper: classes.tabWrapper, root: classes.tabRoot,}} />
                        <Tab label="Transactions" classes={{label: classes.tabLabel, labelContainer: classes.tabLabelContainer, wrapper: classes.tabWrapper, root: classes.tabRoot,}} />
                        <Tab label="Earnings" classes={{label: classes.tabLabel, labelContainer: classes.tabLabelContainer, wrapper: classes.tabWrapper, root: classes.tabRoot,}} />
                        <Tab label="Advanced" classes={{label: classes.tabLabel, labelContainer: classes.tabLabelContainer, wrapper: classes.tabWrapper, root: classes.tabRoot,}} />
                    </Tabs>
                    <Divider />
                    <div className={classes.tabContentContainer}>
                        {activeTabIndex === 0 && (
                            <div>
                                <div className={classes.contentListItem}>
                                    <Typography className={classes.contentLabel} variant="caption">
                                        {'Date uploaded'}
                                    </Typography>
                                    <Typography className={classes.content} variant="body2">
                                        {moment(parseInt(video.createdAt, 10)).format('M/D/YYYY')}
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography className={classes.contentLabel} variant="caption">
                                        {'Content creator'}
                                    </Typography>
                                    <Typography className={classes.content} variant="body2">
                                        {video.creatorId}
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography className={classes.contentLabel} variant="caption">
                                        {'Description'}
                                    </Typography>
                                    <Typography className={classes.content} variant="body2">
                                        {video.description}
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography className={classes.contentLabel} variant="caption">
                                        {'File size'}
                                    </Typography>
                                    <Typography className={classes.content} variant="body2">
                                        <FileSize sizeInBytes={video.fileSize} />
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography className={classes.contentLabel} variant="caption">
                                        {'Content dat key'}
                                    </Typography>
                                    <Typography className={classes.content} variant="body2">
                                        {`dat://${video.fileDatKey}`}
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography className={classes.contentLabel} variant="caption">
                                        {'Metadata dat key'}
                                    </Typography>
                                    <Typography className={classes.content} variant="body2">
                                        {`dat://${video.metadataDatKey}`}
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography className={classes.contentLabel} variant="caption">
                                        {'Content metadata'}
                                    </Typography>
                                    <Typography className={classes.content} variant="body2" component="pre">
                                        {JSON.stringify(video.metadata, null, '\t')}
                                    </Typography>
                                </div>
                            </div>
                        )}
                        {activeTabIndex === 1 && (
                            <div>
                                {transactions.purchaseTx && (
                                    <Fragment>
                                        <div className={classes.contentListItem}>
                                            <Typography className={classes.contentLabel} variant="caption">
                                                {'Purchase tx'}
                                            </Typography>
                                            <Typography className={classes.content} variant="body2">
                                                <EtherscanLink type={'tx'} value={transactions.purchaseTx} />
                                            </Typography>
                                        </div>
                                        <Divider />
                                    </Fragment>
                                )}
                                {this.state.purchaseReceipt && (
                                    <Fragment>
                                        <div className={classes.contentListItem}>
                                            <Typography className={classes.contentLabel} variant="caption">
                                                {'Purchase receipt'}
                                            </Typography>
                                            <Typography className={classes.content} variant="body2" component="pre">
                                                {JSON.stringify(this.state.purchaseReceipt, null, '\t')}
                                            </Typography>
                                        </div>
                                        <Divider />
                                    </Fragment>
                                )}
                                {transactions.stakeTx && (
                                    <Fragment>
                                        <div className={classes.contentListItem}>
                                            <Typography className={classes.contentLabel} variant="caption">
                                                {'Stake tx'}
                                            </Typography>
                                            <Typography className={classes.content} variant="body2">
                                                <EtherscanLink type={'tx'} value={transactions.stakeTx} />
                                            </Typography>
                                        </div>
                                        <Divider />
                                    </Fragment>
                                )}
                                {transactions.hostTx && (
                                    <Fragment>
                                        <div className={classes.contentListItem}>
                                            <Typography className={classes.contentLabel} variant="caption">
                                                {'Host tx'}
                                            </Typography>
                                            <Typography className={classes.content} variant="body2">
                                                <EtherscanLink type={'tx'} value={transactions.hostTx} />
                                            </Typography>
                                        </div>
                                    </Fragment>
                                )}
                            </div>
                        )}
                        {activeTabIndex === 2 && metrics && (
                            <div>
                                <div className={classes.contentListItem}>
                                    <Typography className={classes.contentLabel} variant="caption">
                                        {'Earnings from stake'}
                                    </Typography>
                                    <Typography className={classes.content} variant="body2">
                                        <TokenBalance baseAmount={metrics.totalStakeEarning} includeAO={true} />
                                        <br/>
                                        {`Staking profits earned by original content owner.`}
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography className={classes.contentLabel} variant="caption">
                                        {'Earnings from hosting'}
                                    </Typography>
                                    <Typography className={classes.content} variant="body2">
                                        <TokenBalance baseAmount={metrics.totalHostEarning} includeAO={true} />
                                        <br/>
                                        {`Profits earned by all content hosts.`}
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography className={classes.contentLabel} variant="caption">
                                        {'Contributed towards foundation'}
                                    </Typography>
                                    <Typography className={classes.content} variant="body2">
                                        <TokenBalance baseAmount={metrics.totalFoundationEarning} includeAO={true} />
                                        <br/>
                                        {`Contributed towards The AO foundation, used for further development of the platform.`}
                                    </Typography>
                                </div>
                            </div>
                        )}
                        {activeTabIndex === 3 && (
                            <div>
                                <div className={classes.contentListItem}>
                                    <Typography className={classes.contentLabel} variant="caption">
                                        {'Content state'}
                                    </Typography>
                                    <Typography className={classes.content} variant="body2">
                                        {video.state}
                                    </Typography>
                                </div>
                                <Divider />
                                <div className={classes.contentListItem}>
                                    <Typography className={classes.contentLabel} variant="caption">
                                        {'Content JSON'}
                                    </Typography>
                                    <Typography className={classes.content} variant="body2" component="pre">
                                        {JSON.stringify(video, null, '\t')}
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

const styles = ({palette, spacing}) => ({
    backNav: {
        position: 'absolute',
        color: 'white',
        top: 45,
        left: 45,
    },
    previewImage: {
        position: 'relative',
        width: '100%',
        paddingBottom: '56.2%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        marginBottom: spacing.unit * 3,
        '& > div': {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: spacing.unit * 2,
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
        },
    },
    title: {
        marginBottom: spacing.unit * 2,
        fontWeight: 'bold',
    },
    contentContainer: {
        marginTop: spacing.unit * 4,
    },
    contentListItem: {
        display: 'flex',   
        paddingTop: spacing.unit * 2,
        paddingBottom: spacing.unit * 4,     
    },
        contentLabel: {
            width: 200,
            paddingRight: spacing.unit * 3,
            paddingTop: 5,
            flexShrink: 0,
            fontWeight: 'bold',
        },
        content: {
            color: '#777777'
        },
    // Tabs
    tabs: {
        marginBottom: spacing.unit * 2,
    },
    tabIndicator: {
        display: 'none'
    },
    tabContentContainer: {
        minHeight: '80vh'
    },
    // Tab
    tabRoot: {
        minWidth: 'initial',
        marginRight: spacing.unit * 3,
        opacity: 0.3,
    },
    tabWrapper: {
        alignItems: 'flex-start',
    },
    tabLabelContainer: {
        paddingLeft: 0,
    },
    tabLabel: {
        fontSize: `1.325rem`,
        color: 'white',
        textTransform: 'none',
    },
})

export default compose(
    withStyles(styles),
    withContentMetrics,
    withEthAddress,
)(AccountVideo)