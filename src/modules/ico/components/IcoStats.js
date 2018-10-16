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
        primordialSaleEnded: boolean,
        primordialSaleActive: boolean,
        primordialTotalSupply: BigNumber,
        primordialMaxSupply: BigNumber,
    },
    web3Connected: boolean,
    // redux bound actions
    updateIcoState: Function,
}

class IcoStats extends Component<Props> {
    props: Props;
    componentDidMount() {
        this.props.updateIcoState()
    }
    render() {
        const { classes, web3Connected } = this.props
        const { primordialTotalSupply, primordialMaxSupply, primordialSaleActive, primordialSaleEnded } = this.props.ico
        let icoPercentageComplete = primordialMaxSupply.lte(0) ? 0 : primordialTotalSupply.div(primordialMaxSupply).times(100).toNumber()
        if ( icoPercentageComplete > 100 )
            icoPercentageComplete = 100
        const icoRemainingSupply = primordialMaxSupply.minus(primordialTotalSupply)
        return (
            <div className={classes.root}>                
                <div className={classes.typeContainer}>                    
                    {!web3Connected && (
                        <Typography variant="caption" className={classes.saleEndedCopy}><AlertIcon className={classes.saleEndedAlertIcon} />{`Connect to web3 to view exchange progress.`}</Typography>
                    )}
                    {primordialSaleEnded && (
                        <Typography variant="caption" className={classes.saleEndedCopy}><AlertIcon className={classes.saleEndedAlertIcon} />{`Event has ended.`}</Typography>
                    )}
                    {primordialSaleActive && !primordialSaleEnded && (
                        <React.Fragment>
                            <Typography variant="caption" style={{marginBottom: 2}}>{`Total exchanged: `}<TokenBalance baseAmount={primordialTotalSupply} decimals={0} isPrimordial={true} /></Typography>
                            <Typography variant="caption">{`Remaining: `}<TokenBalance baseAmount={icoRemainingSupply} decimals={0} isPrimordial={true} /></Typography>
                        </React.Fragment>
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
                {web3Connected && (
                    <Typography variant="body1" className={classes.percentage}>{`${web3Connected ? `${icoPercentageComplete.toFixed(0)}%` : `NA`}`}</Typography>
                )}                
            </div>
        )
    }
}

const styles = (theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        paddingRight: 24,
    },
    typeContainer: {
        marginRight: 24,
        textAlign: 'right',
    },
    progressContainer: {
        flex: 1,
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
    },
    percentage: {
        position: 'absolute',
        right: 40,
    }
});

// NOTE: only exporting here for storybook rendering
export const IcoStatsWithStyles = withStyles(styles)(IcoStats)

export default withIcoState(IcoStatsWithStyles)