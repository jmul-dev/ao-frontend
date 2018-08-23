// @flow
import React, { Component } from 'react';
import withExchangeContainer from '../containers/withExchangeContainer';
import { withTheme } from '@material-ui/core/styles';
import { compose } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import '../styles/exchange.css';
import { PrimaryButton } from '../../../theme';
import CircularProgress from '@material-ui/core/CircularProgress';
import EtherscanLink from '../../etherscan/EtherscanLink';
import { TokenBalance, DenominationInput } from '../../../utils/denominations';
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
                </div>
            </div>
        )
    }
}

export default compose(
    withExchangeContainer,
    withTheme(),
)(Exchange)