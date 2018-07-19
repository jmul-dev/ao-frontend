// @flow
import React, { Component } from 'react';
import withExchangeContainer from '../containers/withExchangeContainer';
import { withTheme } from '@material-ui/core/styles';
import { compose } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import '../styles/exchange.css';
import Account from '../../account/components/Account';
import Button from '@material-ui/core/Button';


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
                        <div style={{display: 'flex'}}>
                            <Account display="ethIcon" size={25} />
                            <Typography>{'My Wallet'}</Typography>
                        </div>                        
                    </Grid>
                    <Grid item xs={4}>
                        <Typography><b>{wallet.tokenBalance.toNumber()}</b> {'AO'}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography><b>{wallet.ethBalance.toNumber()}</b> {'ETH'}</Typography>
                    </Grid>
                </Grid>
                <Grid className="grid" container spacing={16}>
                    <Grid item xs={4}>
                        <Typography>{'Purchase:'}</Typography>
                        <Typography>{`1 AO = ${exchange.exchangeRate.toNumber()} ETH`}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField />
                    </Grid>
                </Grid>
                <Grid className="grid" container spacing={16}>
                    <Grid item xs={4}>
                        <Typography>{'cost'}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography>{`${exchange.exchangeAmountEth.toNumber()} ETH`}</Typography>
                    </Grid>
                </Grid>
                <Grid className="grid" container spacing={16}>
                    <Grid item xs={4}>
                        <Typography>{'with funds from'}</Typography>                        
                    </Grid>
                    <Grid item xs={8}>
                        <Typography>{'account:'}</Typography>
                        <Typography>{ethAddress}</Typography>
                    </Grid>
                </Grid>
                <Grid className="grid" container spacing={16}>
                    <Grid item xs={8} style={{marginLeft: 'auto'}}>
                        <Button color="primary" variant="flat">{'Purchase'}</Button>
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