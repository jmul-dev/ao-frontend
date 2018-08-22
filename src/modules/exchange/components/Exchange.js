// @flow
import React, { Component } from 'react';
import withExchangeContainer from '../containers/withExchangeContainer';
import { withTheme } from '@material-ui/core/styles';
import { compose } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import '../styles/exchange.css';
import Account from '../../account/components/Account';
import { PrimaryButton } from '../../../theme';
import CircularProgress from '@material-ui/core/CircularProgress';
import EtherscanLink from '../../etherscan/EtherscanLink';
import { TokenBalance, formattedTokenAmount, DenominationInput } from '../../../utils/denominations';
import BigNumber from 'bignumber.js';


type Props = {
    // props
    title: string,
    subtitle: string,
    requiredTokenAmount?: number,
    requiredTokenCopy?: string,  // required {tokenAmount} to {copy} <--
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
}

class Exchange extends Component<Props> {
    props: Props;
    
    componentDidMount() {
        const { getEthBalanceForAccount, getTokenBalanceForAccount, getExchangeRate, ethAddress, requiredTokenAmount, updateTokenExchangeAmount } = this.props
        getEthBalanceForAccount(ethAddress)
        getTokenBalanceForAccount(ethAddress)
        getExchangeRate()
        if ( requiredTokenAmount ) {
            console.log(`set initial token exchange amount: ${requiredTokenAmount}`)
            updateTokenExchangeAmount( requiredTokenAmount )
            // setTimeout(() => {
            //     this.refs.tokenInput.updateToLargestDenomination()
            // }, 50)            
        }
    }
    _onInputChange = ({baseInputValue, denominationValue, denomination}) => {
        this.props.updateTokenExchangeAmount(baseInputValue, denomination)
    }    
    _handlePurchase = () => {
        const { exchangeAmountToken, exchangeRate } = this.props.exchange
        this.props.purchaseTokens( exchangeAmountToken, exchangeRate )
    }
    _resetExchangeForm = () => {
        this.props.resetExchange()
    }
    render() {
        const { ethAddress, exchange, wallet, theme, title, subtitle, requiredTokenAmount, requiredTokenCopy } = this.props   
        const { exchangeTransaction, exchangeAmountToken, exchangeDenomination, exchangeRate } = exchange
        const exchangeInProgress = exchangeTransaction.initialized && !exchangeTransaction.error
        const formDisabled = !ethAddress || exchangeInProgress || !this.props.ico.primordialSaleActive
        const showExchangeTransactionMessage = exchangeTransaction.error || exchangeTransaction.initialized || exchangeTransaction.transactionHash || exchangeTransaction.result
        const formattedTokenBalance = formattedTokenAmount(wallet.tokenBalance)
        const ethCost = exchangeAmountToken.multipliedBy(exchangeRate)
        const tokensNeeded = requiredTokenAmount ? new BigNumber(requiredTokenAmount).minus(wallet.networkTokenBalance) : new BigNumber(0)
        const tokensInput = tokensNeeded.gt(exchange.exchangeAmountToken) ? tokensNeeded : exchange.exchangeAmountToken
        return (
            <div className={`Exchange ${formDisabled ? 'disabled' : ''}`} style={{backgroundColor: theme.palette.background.default}}>
                {requiredTokenAmount ? (
                    <div className="content-pane" style={{backgroundColor: '#151515'}}>
                        <Typography variant="title" align="center" style={{marginBottom: 0}}>{title}</Typography>
                        <Typography variant="body1" align="center" style={{marginBottom: 36, color: '#777'}}>{subtitle}</Typography>
                        <div className="line-item">
                            <Typography variant="caption">{`Your balance:`}</Typography>
                            <Typography variant="body1">
                                <TokenBalance baseAmount={wallet.networkTokenBalance} includeAO={true} isPrimordial={false} />
                            </Typography>
                        </div>
                        <div className="line-item">
                            <Typography variant="caption">{requiredTokenCopy}</Typography>
                            <Typography variant="body1">
                                <TokenBalance baseAmount={requiredTokenAmount} includeAO={true} isPrimordial={false} />
                            </Typography>
                        </div>
                        <div className="line-item divider"></div>
                        <div className="line-item">
                            <Typography variant="body1">{`AO needed:`}</Typography>
                            <Typography variant="body1">
                                <TokenBalance baseAmount={tokensNeeded} includeAO={true} isPrimordial={false} />
                            </Typography>
                        </div>
                        <div className="triangle"></div>
                    </div>
                ) : null}
                <div className="input-pane">                
                    <Typography variant="subheading" align="center" style={{marginBottom: 24}}>{`How much AO+ would you like to purchase?`}</Typography>
                    <div className="input-container" style={{backgroundColor: theme.palette.type === 'dark' ? '#333333' : '#AAAAAA'}}>
                        <DenominationInput 
                            ref="tokenInput"
                            baseInputValue={tokensInput}
                            isPrimordial={true}
                            disabled={formDisabled}
                            onChange={this._onInputChange}
                        />
                    </div>
                    <div className="input-cost">
                        <Typography variant="body1">{`cost: ${ethCost.toNumber()} ETH`}</Typography>
                        <Typography variant="caption">{`(1 ${exchangeDenomination.prefix} AO = ${exchange.exchangeRate.multipliedBy(Math.pow(10, exchangeDenomination.powerOfTen)).toNumber()} ETH)`}</Typography>
                    </div>
                    {showExchangeTransactionMessage ? (
                        <div className="tx-message" style={{textAlign: 'right'}}>
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
                        </div>
                    ) : null}
                    <div className="action">
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
                    </div>
                    {/* <Grid className="grid on-pending" container spacing={16} alignItems="center" style={{paddingBottom: requiredTokenAmount ? 38 : undefined}}>
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
                                    {`need `}<TokenBalance baseAmount={requiredTokenAmount} />{` to ${requiredTokenCopy ? requiredTokenCopy : 'watch'}`}
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
                                <DenominationInput 
                                    baseInputValue={exchange.exchangeAmountToken}
                                    disabled={formDisabled}
                                    onChange={this._onInputChange}
                                />
                            </div>                        
                        </Grid>
                    </Grid>
                    <Grid className="grid on-pending" container spacing={16} alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="caption">{'cost'}</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="subheading">{`${ethCost.toNumber()} ETH`}</Typography>
                            {ethCost.gte(wallet.ethBalance) ? (
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
                    </Grid> */}
                </div>
            </div>
        )
    }
}

export default compose(
    withExchangeContainer,
    withTheme(),
)(Exchange)