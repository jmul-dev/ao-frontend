import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import BigNumber from "bignumber.js";
import Typography from '@material-ui/core/Typography';
import { TokenBalance } from '../../../utils/denominations';
import DatStats from '../../content/components/DatStats';


const styles = ({}) => ({
    root: {
        display: 'flex',
        '& > div + div': {
            marginLeft: 40,
        }
    },
})

class AccountVideoStats extends PureComponent {
    static propTypes = {
        video: PropTypes.object.isRequired,
        metrics: PropTypes.shape({
            networkTokenStaked: PropTypes.instanceOf(BigNumber),
            primordialTokenStaked: PropTypes.instanceOf(BigNumber),
            primordialTokenStakedWeight: PropTypes.instanceOf(BigNumber),
            totalStakeEarning: PropTypes.instanceOf(BigNumber),
            totalHostEarning: PropTypes.instanceOf(BigNumber),
            totalFoundationEarning: PropTypes.instanceOf(BigNumber),
        }),
        includeDownloadSpeed: PropTypes.bool,
        align: PropTypes.oneOf(['left', 'right']),
        // withStyles
        classes: PropTypes.object.isRequired,
    }
    render() {
        const { classes, video, metrics, align, includeDownloadSpeed } = this.props
        return (
            <div className={classes.root} style={{justifyContent: align === 'right' ? 'flex-end' : 'flex-start'}}>
                <div>
                    <Typography variant="body1" gutterBottom color="textSecondary" component="div">{'peers'}</Typography>
                    <Typography variant="body2" color="textSecondary" component="div">
                        <DatStats renderPeerCount stats={[video.metadataDatStats, video.fileDatStats]} />
                    </Typography>
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
                {includeDownloadSpeed ? (
                    <div>
                        <Typography variant="body1" gutterBottom color="textSecondary" component="div">{'download speed'}</Typography>
                        <Typography variant="body2" color="textSecondary" component="div">
                            <DatStats renderDownloadSpeed stats={[video.metadataDatStats, video.fileDatStats]} />
                        </Typography>
                    </div>
                ) : null}                
            </div>
        )
    }
}
export default withStyles(styles)(AccountVideoStats)