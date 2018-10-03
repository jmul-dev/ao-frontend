import React, { Component, Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import withContentMetrics from '../containers/withContentMetrics';
import moment from 'moment';
import Collapse from '@material-ui/core/Collapse';
import { TokenBalance, FileSize } from '../../../utils/denominations';
import PropTypes from 'prop-types';
import { ContentPurchaseAction, ContentPurchaseState, getContentState } from '../../video/components/ContentPurchaseActions';
import DatStats from '../../content/components/DatStats';
import EtherscanLink from '../../etherscan/EtherscanLink';
import BigNumber from "bignumber.js";
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'react-apollo';
import { Link } from 'react-router-dom';


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
        // withStyles
        classes: PropTypes.object.isRequired,
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
        if ( this.props.video.purchaseId ) {
            this.props.getPurchaseReceipt(this.props.video.purchaseId).then(result => {
                this.setState({ purchaseReceipt: result })
            })
        }
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
    _renderCardState() {
        const { video, metrics, classes } = this.props
        const { isLoadingState, isCompleted, stateCopy, StateIcon, actionRequired, actionCopy } = getContentState(video)
        if ( isCompleted ) {
            let peerCount = 0
            let uploadSpeed = 0
            if ( video.metadataDatStats ) {
                peerCount+= video.metadataDatStats.peersTotal
                uploadSpeed+= video.metadataDatStats.uploadSpeed
            }
            if ( video.fileDatStats ) {
                peerCount+= video.fileDatStats.peersTotal
            }
            return (
                <ButtonBase component={Link} to={`/app/view/videos/${video.id}`} className={classes.completedCardStateContainer}>
                    <Typography variant="display3" className={classes.completedCardStateContainerTitle}>
                        {video.title}
                    </Typography>
                    <div className={classes.statsContainer}>
                        <div>
                            <Typography variant="body1" gutterBottom color="textSecondary" component="div">{'peers'}</Typography>
                            <Typography variant="body2" color="textSecondary" component="div">{peerCount}</Typography>
                        </div>
                        {video.stakeId && metrics ? (
                            <div>
                                <Typography variant="body1" gutterBottom color="textSecondary" component="div">{'earnings'}</Typography>
                                <Typography variant="body2" color="textSecondary" component="div">
                                    <TokenBalance baseAmount={metrics.totalStakeEarning.plus(metrics.totalHostEarning)} includeAO={true} />
                                </Typography>
                            </div>
                        ) : null}
                        {metrics ? (
                            <div>
                                <Typography variant="body1" gutterBottom color="textSecondary" component="div">{'stake'}</Typography>
                                <Typography variant="body2" color="textSecondary" component="div">
                                    {metrics.primordialTokenStaked.gt(0) ? (
                                        <div>
                                            <TokenBalance baseAmount={metrics.primordialTokenStaked} includeAO={true} />
                                        </div>
                                    ) : null}
                                    {metrics.networkTokenStaked.gt(0) ? (
                                        <div>
                                            <TokenBalance baseAmount={metrics.networkTokenStaked} includeAO={false} />
                                        </div>
                                    ) : null}
                                </Typography>
                            </div>
                        ) : null}
                        <div>
                            <Typography variant="body1" gutterBottom color="textSecondary" component="div">{'upload speed'}</Typography>
                            <Typography variant="body2" color="textSecondary" component="div">
                                <DatStats renderUploadSpeed stats={[video.metadataDatStats, video.fileDatStats]} />
                            </Typography>
                        </div>
                    </div>
                    {/* <Typography variant="body1" gutterBottom color="textSecondary">
                        {`uploaded: ${moment(parseInt(video.createdAt, 10)).format('M/D/YYYY')}`}
                    </Typography>
                    <DatStats stats={[video.metadataDatStats, video.fileDatStats]} />
                    <Typography variant="body1" gutterBottom color="textSecondary" component="div">
                        {video.stakeId && metrics ? this._renderContentMetrics() : (
                            <Fragment>
                                {!video.stakeId ? `Video has not been staked!` : `Video staked, fetching metrics...`}
                            </Fragment>
                        )}
                    </Typography> */}
                    {/* <Typography className="txs" variant="body1" gutterBottom color="textSecondary">
                        {transactions.stakeTx ? (
                            <EtherscanLink type={'tx'} value={transactions.stakeTx}>{`Stake Tx`}</EtherscanLink>
                        ) : null}
                        {transactions.hostTx ? (
                            <EtherscanLink type={'tx'} value={transactions.hostTx}>{`Host Tx`}</EtherscanLink>
                        ) : null}
                        {transactions.purchaseTx ? (
                            <EtherscanLink type={'tx'} value={transactions.purchaseTx}>{`Purchase Tx`}</EtherscanLink>
                        ) : null}
                    </Typography> */}
                </ButtonBase>
            )
        } else {
            return (
                <div className={classes.incompleteCardStateContainer}>
                    <div className={classes.stateIconContainer}>
                        <StateIcon className={classes.stateIcon} />
                    </div>
                    <div>
                        <Typography variant="body1" gutterBottom color="textSecondary" component="div">{video.title}</Typography>
                        <ContentPurchaseAction contentRef={this._watchNowRef} content={video}>{({ action, actionCopy, loading }) => (
                            <ButtonBase onClick={action} disabled={!action || loading}>
                                <Typography variant="body1" gutterBottom color={!action || loading ? "textSecondary" : "primary"}>{stateCopy || actionCopy}</Typography>
                            </ButtonBase>
                        )}</ContentPurchaseAction>
                    </div>
                </div>
            )
        }        
    }
    render() {
        const { video, filter, classes } = this.props
        const transactions = video.transactions || {}
        const isCompletedState = video.state === 'DISCOVERABLE'
        return (
            <Grid className={classes.root} container spacing={16}>
                <Grid item sm={4}>
                    <ContentPurchaseAction contentRef={this._watchNowRef} content={video}>{({ action, actionCopy, loading }) => {
                        // NOTE: only rendering the "play" action on previewImage
                        return (
                            <ButtonBase className={classes.previewImageButton} disabled={!isCompletedState} onClick={action}>
                                <div ref={ref => this._watchNowRef = ref} className={classes.previewImage} style={{ backgroundImage: `url(${window.AO_CORE_URL}/${video.featuredImageUrl})`, opacity: isCompletedState ? 1 : 0.15  }}>
                                    {isCompletedState ? (
                                        <ContentPurchaseState content={video} />
                                    ) : null}
                                </div>
                            </ButtonBase>
                        )
                    }}</ContentPurchaseAction>
                </Grid>
                <Grid item sm={8} className={classes.cardStateContainer}>
                    {this._renderCardState()}                    
                </Grid>
            </Grid>
        )
    }
    // _renderTabData() {
    //     const { video } = this.props
    //     const { tabIndex } = this.state
    //     switch (tabIndex) {
    //         case 0:
    //             return (
    //                 <div>
    //                     <Typography className="description" variant="body1" gutterBottom color="textSecondary">
    //                         {video.description}
    //                     </Typography>
    //                     <Typography variant="body1" gutterBottom color="textSecondary">
    //                         {`Content dat key: dat://${video.fileDatKey}`}
    //                     </Typography>
    //                     <Typography variant="body1" gutterBottom color="textSecondary">
    //                         {`Metadata dat key: dat://${video.metadataDatKey}`}
    //                     </Typography>
    //                     <Typography variant="body1" gutterBottom color="textSecondary">
    //                         {`File size: `}<FileSize sizeInBytes={video.fileSize} />
    //                     </Typography>
    //                 </div>
    //             )
    //         case 1:
    //             return (
    //                 <div>
    //                     {this.state.purchaseReceipt ? (
    //                         <Typography variant="body1" component="pre">
    //                             Purchase receipt:
    //                             {JSON.stringify(this.state.purchaseReceipt, null, '\t')}
    //                         </Typography>
    //                     ) : null}
    //                     <Typography component="pre">
    //                         {JSON.stringify(video, null, '\t')}
    //                     </Typography>
    //                 </div>
    //             )
    //         default:
    //             return null
    //     }
    // }
}

const styles = ({spacing}) => ({
    root: {
        paddingTop: spacing.unit,
        paddingBottom: spacing.unit,
    },
    previewImageButton: {
        width: '100%',
        display: 'block',
    },
        previewImage: {
            position: 'relative',
            width: '100%',
            paddingBottom: '56.2%',
            background: '#E5E5E5',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            overflow: 'hidden',
            '& > div': {
                position: 'absolute',
                bottom: 0,
                right: 0,
                padding: spacing.unit,
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
            },
        },
    cardStateContainer: {

    },
    completedCardStateContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        height: '100%',
    },
        completedCardStateContainerTitle: {
            marginBottom: spacing.unit * 2
        },
        statsContainer: {
            width: '100%',
            display: 'flex',
            paddingLeft: 40,
            '& > div': {
                marginRight: 40,
            }       
        },
    incompleteCardStateContainer: {
        display: 'flex',
        height: '100%',
        alignItems: 'center',
    },
        stateIconContainer: {
            marginRight: spacing.unit * 2,
            marginBottom: 26,
        },
            stateIcon: {                
                width: `24px !important`,
                height: `24px !important`,
                color: 'white',
            },
})

export default compose(
    withContentMetrics,
    withStyles(styles),
)(AccountVideoListItem)

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
