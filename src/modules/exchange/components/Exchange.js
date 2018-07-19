// @flow
import React, { Component } from 'react';
import withExchangeContainer from '../containers/withExchangeContainer';
import { withTheme } from '@material-ui/core/styles';
import { compose } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import '../styles/exchange.css';


type Props = {
    // props
    title: string,
    subtitle: string,
    // withTheme
    theme: Object,  // material-ui theme
    // redux bound state
    ethAddress: string,
    wallet: Object,
    exchange: Object,
    isElectron: boolean,
    // redux bound actions
    getEthBalanceForAccount: Function,
    getTokenBalanceForAccount: Function,
    getExchangeRate: Function,
    purchaseTokens: Function,
}

class Exchange extends Component<Props> {
    props: Props;
    componentDidMount() {
        const { getEthBalanceForAccount, getTokenBalanceForAccount, getExchangeRate, ethAddress } = this.props
        getEthBalanceForAccount(ethAddress)
        getTokenBalanceForAccount(ethAddress)
        getExchangeRate()
    }
    render() {
        const { ethAddress, exchange, wallet, theme, title, subtitle } = this.props
        return (
            <div className="Exchange" style={{backgroundColor: theme.palette.background.default}}>
                <Typography variant="title" align="center" style={{marginBottom: 8}}>{title}</Typography>
                <Typography variant="body1" align="center" style={{marginBottom: 48, fontSize: '1.125rem'}}>{subtitle}</Typography>
                <Grid className="grid" container spacing={16}>
                    <Grid item xs={4}>
                        [my wallet]
                    </Grid>
                    <Grid item xs={4}>
                        [ao balance]
                    </Grid>
                    <Grid item xs={4}>
                        [eth balance]
                    </Grid>
                </Grid>
                <Grid className="grid" container spacing={16}>
                    <Grid item xs={4}>
                        [exchange rate]
                    </Grid>
                    <Grid item xs={8}>
                        [input]
                    </Grid>
                </Grid>
                <Grid className="grid" container spacing={16}>
                    <Grid item xs={4}>
                        [cost]
                    </Grid>
                    <Grid item xs={8}>
                        [cost value]
                    </Grid>
                </Grid>
                <Grid className="grid" container spacing={16}>
                    <Grid item xs={4}>
                        [with funds from]
                    </Grid>
                    <Grid item xs={8}>
                        [account address]
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default compose(
    withExchangeContainer,
    withTheme(),
)(Exchange)