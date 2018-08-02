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
import { PrimaryButton } from '../../../theme';
import CircularProgress from '@material-ui/core/CircularProgress';
import EtherscanLink from '../../etherscan/EtherscanLink';
import { TokenBalance, formattedTokenAmount, denominations } from '../../../utils/denominations';
import DenominationSelect from './DenominationSelect';


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
    resetExchange: Function,
    updateExchangeDenomination: Function,
}

class Exchange extends Component<Props> {
    props: Props;
    componentDidMount() {
        const { getEthBalanceForAccount, getTokenBalanceForAccount, getExchangeRate, ethAddress, requiredTokenAmount, updateTokenExchangeAmount } = this.props
        getEthBalanceForAccount(ethAddress)
        getTokenBalanceForAccount(ethAddress)
        getExchangeRate()        
        if ( requiredTokenAmount ) {
            updateTokenExchangeAmount( requiredTokenAmount )
        }
    }
    _onTokenExchangeAmountChange = (event) => {
        let inputValue = event.target.value
        this.props.updateTokenExchangeAmount(inputValue)
    }
    _onDenominationInputChange = (event) => {
        const nextDenom = denominations.find(function(denom) { return denom.name === event.target.value})
        if ( nextDenom ) {
            this.props.updateExchangeDenomination(nextDenom)
        }
    }
    _handlePurchase = () => {
        const { exchangeAmountToken, exchangeDenomination, exchangeRate } = this.props.exchange
        this.props.purchaseTokens( exchangeAmountToken, exchangeDenomination, exchangeRate )
    }
    _resetExchangeForm = () => {
        this.props.resetExchange()
    }
    render() {
        const { ethAddress, exchange, wallet, theme, title, subtitle, requiredTokenAmount } = this.props   
        const { exchangeTransaction, exchangeDenomination, exchangeAmountToken, exchangeRate } = exchange     
        const exchangeInProgress = exchangeTransaction.initialized && !exchangeTransaction.error
        const formDisabled = !ethAddress || exchangeInProgress
        const showExchangeTransactionMessage = exchangeTransaction.error || exchangeTransaction.initialized || exchangeTransaction.transactionHash || exchangeTransaction.result
        const formattedTokenBalance = formattedTokenAmount(wallet.tokenBalance)
        const ethCostInCurrentDenomination = exchangeAmountToken.multipliedBy(Math.pow(10, exchangeDenomination.powerOfTen)).multipliedBy(exchangeRate)
        return (
            <div className={`Exchange ${formDisabled ? 'disabled' : ''}`} style={{backgroundColor: theme.palette.background.default}}>
                <Typography variant="title" align="center" style={{marginBottom: 0}}>{title}</Typography>
                <Typography variant="body1" align="center" style={{marginBottom: 36, fontSize: '1.125rem', color: '#777'}}>{subtitle}</Typography>
                <Grid className="grid on-pending" container spacing={16} alignItems="center" style={{paddingBottom: requiredTokenAmount ? 38 : undefined}}>
                    <Grid item xs={4}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Account display="ethIcon" size={25} />
                            <Typography variant="subheading" style={{marginLeft: 8}}>{'My Wallet'}</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div style={{display: 'flex', alignItems: 'flex-end'}}>
                            <Typography variant="title">{formattedTokenBalance.value}</Typography>
                            <Typography>{formattedTokenBalance.label}</Typography>
                        </div>
                        {requiredTokenAmount ? (
                            <Typography variant="caption" className="required-token-amount" color="error">
                                {`need `}<TokenBalance baseAmount={requiredTokenAmount} />{` to watch`}
                            </Typography>
                        ) : null}
                    </Grid>
                    <Grid item xs={4}>
                        <div style={{display: 'flex', alignItems: 'flex-end'}}> 
                            <Typography variant="title">{wallet.ethBalance.toFixed(3)}</Typography> 
                            <Typography>{'ETH'}</Typography>
                        </div>
                    </Grid>
                </Grid>
                <Grid className="grid on-pending" container spacing={16}>
                    <Grid item xs={4}>
                        <Typography variant="subheading">{'Purchase:'}</Typography>
                        <Typography variant="caption">{`1 Giga AO = ${exchange.exchangeRate.multipliedBy(Math.pow(10, 9)).toNumber()} ETH`}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <div className="input-container" style={{backgroundColor: theme.palette.type === 'dark' ? '#333333' : '#AAAAAA'}}>
                            <TextField 
                                fullWidth 
                                InputProps={{
                                    disableUnderline: true,
                                    type: "number"
                                }}
                                value={exchange.exchangeAmountToken.toString()}
                                onChange={this._onTokenExchangeAmountChange}
                                disabled={formDisabled}
                            />
                            <DenominationSelect
                                native
                                value={exchange.exchangeDenomination.name}
                                onChange={this._onDenominationInputChange}
                                disableUnderline={true}
                                >
                                {denominations.map((denomination) => (
                                    <option key={denomination.name} value={denomination.name}>{`${denomination.prefix} AO`}</option>
                                ))}
                            </DenominationSelect>
                        </div>                        
                    </Grid>
                </Grid>
                <Grid className="grid on-pending" container spacing={16} alignItems="center">
                    <Grid item xs={4}>
                        <Typography variant="caption">{'cost'}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="subheading">{`${ethCostInCurrentDenomination.toNumber()} ETH`}</Typography>
                        {ethCostInCurrentDenomination.gte(wallet.ethBalance) ? (
                            <Typography variant="caption" color="error" style={{marginTop: -2}}>{`max ETH balance reached!`}</Typography>
                        ) : null}
                    </Grid>
                </Grid>
                <Grid className="grid on-pending" container spacing={16}>
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
                <Grid className="grid" container spacing={16} style={{paddingBottom: 0}}>
                    {showExchangeTransactionMessage ? (
                        <Grid item xs={12} style={{textAlign: 'right'}}>
                            {exchangeTransaction.error ? (
                                <Typography color="error">{exchangeTransaction.error.message}</Typography>                                
                            ) : null}
                            {exchangeTransaction.initialized && !exchangeTransaction.transactionHash && !exchangeTransaction.error ? (
                                <Typography color="default">{`Please check Metamask to approve this transaction`}</Typography>
                            ) : null}
                            {exchangeTransaction.transactionHash && !exchangeTransaction.result ? (
                                <Typography color="default">
                                    {'tx: '} <EtherscanLink type="tx" value={exchangeTransaction.transactionHash} style={{maxWidth: '80%'}} />
                                </Typography>
                            ) : null}
                            {exchangeTransaction.result ? (
                                <Typography color="primary">{`Your AO purchase was succesful!`}</Typography>
                            ) : null}
                        </Grid>
                    ) : null}
                    <Grid item xs={8} style={{marginLeft: 'auto'}}>
                        {exchangeTransaction.result ? (
                            <PrimaryButton 
                                color="primary" 
                                variant="flat" 
                                fullWidth 
                                onClick={this._resetExchangeForm}
                                disabled={false}
                                >
                                {'Make another purchase   ↺'}
                            </PrimaryButton>
                        ) : (
                            <PrimaryButton 
                                color="primary" 
                                variant="flat" 
                                fullWidth 
                                onClick={this._handlePurchase}
                                disabled={formDisabled}
                                >
                                {exchangeInProgress ? 'Pending...' : 'Purchase'}
                                {exchangeInProgress ? (
                                    <CircularProgress size={25} style={{position: 'absolute', right: 6}} />
                                ) : null}
                            </PrimaryButton>
                        )}
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