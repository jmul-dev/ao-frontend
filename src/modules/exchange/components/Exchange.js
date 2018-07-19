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
    requiredTokenAmount?: number,
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
    updateTokenExchangeAmount: Function,
}

class Exchange extends Component<Props> {
    props: Props;
    componentDidMount() {
        const { getEthBalanceForAccount, getTokenBalanceForAccount, getExchangeRate, ethAddress } = this.props
        getEthBalanceForAccount(ethAddress)
        getTokenBalanceForAccount(ethAddress)
        getExchangeRate()
    }
    _onTokenExchangeAmountChange = (event) => {
        let inputValue = event.target.value
        this.props.updateTokenExchangeAmount(inputValue)
    }
    _handlePurchase = () => {
        const { exchangeAmountToken, exchangeAmountEth } = this.props.exchange
        this.props.purchaseTokens( exchangeAmountToken, exchangeAmountEth )
    }
    render() {
        const { ethAddress, exchange, wallet, theme, title, subtitle, requiredTokenAmount } = this.props        
        return (
            <div className="Exchange" style={{backgroundColor: theme.palette.background.default}}>
                <Typography variant="title" align="center" style={{marginBottom: 8}}>{title}</Typography>
                <Typography variant="body1" align="center" style={{marginBottom: 48, fontSize: '1.125rem'}}>{subtitle}</Typography>
                <Grid className="grid" container spacing={16} alignItems="center" style={{paddingBottom: requiredTokenAmount ? 38 : undefined}}>
                    <Grid item xs={4}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Account display="ethIcon" size={25} />
                            <Typography variant="subheading" style={{marginLeft: 8}}>{'My Wallet'}</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div style={{display: 'flex', alignItems: 'flex-end'}}>
                            <Typography variant="title">{wallet.tokenBalance.toFixed(3)}</Typography>
                            <Typography>{'AO'}</Typography>
                        </div>
                        {requiredTokenAmount ? (
                            <Typography variant="caption" className="required-token-amount" color="error">{`need ${requiredTokenAmount} AO to watch`}</Typography>
                        ) : null}                        
                    </Grid>
                    <Grid item xs={4}>
                        <div style={{display: 'flex', alignItems: 'flex-end'}}> 
                            <Typography variant="title">{wallet.ethBalance.toFixed(3)}</Typography> 
                            <Typography>{'ETH'}</Typography>
                        </div>
                    </Grid>
                </Grid>
                <Grid className="grid" container spacing={16}>
                    <Grid item xs={4}>
                        <Typography variant="subheading">{'Purchase:'}</Typography>
                        <Typography variant="caption">{`1 AO = ${exchange.exchangeRate.toNumber()} ETH`}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <div className="input-container">
                            <TextField 
                                fullWidth 
                                InputProps={{
                                    disableUnderline: true,
                                    type: "number"
                                }}
                                value={exchange.exchangeAmountToken.toString()}
                                onChange={this._onTokenExchangeAmountChange}
                                disabled={exchange.exchangeTransaction.initialized && !exchange.exchangeTransaction.error}
                            />
                            <Typography style={{marginBottom: 8}}>{'AO'}</Typography>
                        </div>                        
                    </Grid>
                </Grid>
                <Grid className="grid" container spacing={16} alignItems="center">
                    <Grid item xs={4}>
                        <Typography variant="caption">{'cost'}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="subheading">{`${exchange.exchangeAmountEth.toNumber()} ETH`}</Typography>
                    </Grid>
                </Grid>
                <Grid className="grid" container spacing={16}>
                    <Grid item xs={4}>
                        <Typography variant="caption">{'with funds from'}</Typography>                        
                    </Grid>
                    <Grid item xs={8}>
                        <div style={{overflow: 'hidden', wordWrap: 'break-word'}}>
                            <Typography variant="caption">{'account:'}</Typography>
                            <Typography>{ethAddress}</Typography>
                        </div>
                    </Grid>
                </Grid>
                <Grid className="grid" container spacing={16}>
                    <Grid item xs={8} style={{marginLeft: 'auto'}}>
                        <Button 
                            color="primary" 
                            variant="flat" 
                            fullWidth 
                            onClick={this._handlePurchase}
                            disabled={exchange.exchangeTransaction.initialized && !exchange.exchangeTransaction.error}
                            >
                            {'Purchase'}
                        </Button>
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