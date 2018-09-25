// @flow
import React, { Component } from 'react';
import withIcoState from '../containers/withIcoState';
import BigNumber from 'bignumber.js';
import { TokenBalance } from '../../../utils/denominations';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import AlertIcon from '@material-ui/icons/ErrorOutline';


type Props = {
    classes: Object,
    // redux bound state
    ico: {
        primordialSaleActive: boolean,
        primordialTotalSupply: BigNumber,
        primordialMaxSupply: BigNumber,
    },
    // redux bound actions
    updateIcoState: Function,
}

class IcoStats extends Component<Props> {
    props: Props;
    componentDidMount() {
        this.props.updateIcoState()
    }
    render() {
        const { classes } = this.props
        const { primordialTotalSupply, primordialMaxSupply, primordialSaleActive } = this.props.ico
        const icoPercentageComplete = primordialMaxSupply.lte(0) ? 0 : primordialTotalSupply.div(primordialMaxSupply).times(100).toNumber()
        const icoRemainingSupply = primordialMaxSupply.minus(primordialTotalSupply)
        return (
            <div className={classes.root}>
                <div className={classes.typeContainer}>
                    <Typography variant="body1" style={{marginBottom: 4}}>{`Network Exchange Progress: ${icoPercentageComplete.toFixed(0)}%`}</Typography>                    
                    {primordialSaleActive ? (
                        <React.Fragment>
                            <Typography variant="caption" style={{marginBottom: 2}}>{`Total exchanged: `}<TokenBalance baseAmount={primordialTotalSupply} decimals={0} isPrimordial={true} /></Typography>
                            <Typography variant="caption">{`Remaining: `}<TokenBalance baseAmount={icoRemainingSupply} decimals={0} isPrimordial={true} /></Typography>
                        </React.Fragment>
                    ) : (
                        <Typography variant="caption" className={classes.saleEndedCopy}><AlertIcon className={classes.saleEndedAlertIcon} />{`Event has ended.`}</Typography>
                    )}
                </div>
                <div className={classes.progressContainer}>
                    <LinearProgress 
                        variant="determinate" 
                        value={icoPercentageComplete} 
                        classes={{
                            root: classes.linearProgressRoot
                        }}
                    />
                </div>
            </div>
        )
    }
}

const styles = (theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    typeContainer: {
        marginRight: 48
    },
    progressContainer: {
        flex: 1
    },
    linearProgressRoot: {
        backgroundColor: `rgba(255,255,255,0.2)`,
        height: 10,
        borderRadius: 5,
    },
    saleEndedCopy: {
        display: 'flex',
        alignItems: 'center'
    },
    saleEndedAlertIcon: {
        marginRight: 4,
        fontSize: 18,
    }
});

// NOTE: only exporting here for storybook rendering
export const IcoStatsWithStyles = withStyles(styles)(IcoStats)

export default withIcoState(IcoStatsWithStyles)