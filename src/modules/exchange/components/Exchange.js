// @flow
import React, { Component, Fragment } from 'react';
import withExchangeContainer from '../containers/withExchangeContainer';
import Typography from '@material-ui/core/Typography';
import '../styles/exchange.css';
import { PrimaryButton } from '../../../theme';
import CircularProgress from '@material-ui/core/CircularProgress';
import EtherscanLink from '../../etherscan/EtherscanLink';
import { TokenBalance, DenominationInput } from '../../../utils/denominations';
import BigNumber from 'bignumber.js';
import { compose } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';


type Props = {
    // props
    title: string,
    subtitle: string,
    requiredNetworkTokenAmount?: number,
    requiredPrimordialTokenAmount?: number,
    requiredTokenCopy?: string,  // required {tokenAmount} to {copy} <--
    icoRemainingSupply: BigNumber,
    hideInputTitle?: boolean,
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

const styles = ({palette}) => ({
    contentPane: {
        backgroundColor: palette.type === 'dark' ? '#151515' : palette.background.paper,
    },
    contentPaneTriangle: {
        borderColor: palette.type === 'dark' ? '#151515 transparent transparent transparent' : `${palette.background.paper} transparent transparent transparent`,
    }
})

class Exchange extends Component<Props> {
    props: Props;    
    componentDidMount() {
        const { getEthBalanceForAccount, getTokenBalanceForAccount, getExchangeRate, ethAddress, requiredNetworkTokenAmount, requiredPrimordialTokenAmount, updateTokenExchangeAmount } = this.props
        getEthBalanceForAccount(ethAddress)
        getTokenBalanceForAccount(ethAddress)
        getExchangeRate()        
        if ( requiredNetworkTokenAmount || requiredPrimordialTokenAmount ) {
            updateTokenExchangeAmount( Math.max(requiredNetworkTokenAmount, requiredPrimordialTokenAmount) )
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
        const { ethAddress, exchange, wallet, title, subtitle, requiredNetworkTokenAmount, requiredPrimordialTokenAmount, requiredTokenCopy, icoRemainingSupply, hideInputTitle, classes } = this.props   
        const { exchangeTransaction, exchangeAmountToken, exchangeDenomination, exchangeRate } = exchange
        const exchangeInProgress = exchangeTransaction.initialized && !exchangeTransaction.error
        const formDisabled = !ethAddress || exchangeInProgress || !this.props.ico.primordialSaleActive
        const showExchangeTransactionMessage = exchangeTransaction.error || exchangeTransaction.initialized || exchangeTransaction.transactionHash || exchangeTransaction.result
        const ethCost = exchangeAmountToken.multipliedBy(exchangeRate)
        // AO vs AO+
        const primordialTokensNeeded = requiredPrimordialTokenAmount ? new BigNumber(requiredPrimordialTokenAmount).minus(wallet.primordialTokenBalance) : new BigNumber(0)
        const networkTokensNeeded = requiredNetworkTokenAmount ? new BigNumber(requiredNetworkTokenAmount).minus(wallet.networkTokenBalance) : new BigNumber(0)
        const tokensNeeded = primordialTokensNeeded.gt(0) || networkTokensNeeded.gt(0) ? new BigNumber(Math.max(primordialTokensNeeded, networkTokensNeeded)) : new BigNumber(0)
        const tokensNeededIsPrimordial = primordialTokensNeeded.gt(0)
        const tokensInput = tokensNeeded.gt(exchange.exchangeAmountToken) ? tokensNeeded : exchange.exchangeAmountToken        
        return (
            <div className={`Exchange ${formDisabled ? 'disabled' : ''}`}>
                {tokensNeeded.gt(0) ? (
                    <div className={`${classes.contentPane} content-pane`}>
                        <Typography variant="title" align="center" style={{marginBottom: 0}}>{title}</Typography>
                        <Typography variant="body1" align="center" style={{marginBottom: 36, color: '#777'}}>{subtitle}</Typography>
                        <div className="line-item">
                            <Typography variant="caption">{`Your balance:`}</Typography>
                            <Typography variant="body1">
                                {tokensNeededIsPrimordial ? (
                                    <TokenBalance baseAmount={wallet.primordialTokenBalance} includeAO={true} isPrimordial={true} />
                                ) : (
                                    <TokenBalance baseAmount={wallet.networkTokenBalance} includeAO={true} isPrimordial={false} />
                                )}                                
                            </Typography>
                        </div>
                        <div className="line-item">
                            <Typography variant="caption">{requiredTokenCopy}</Typography>
                            <Typography variant="body1">
                                <TokenBalance baseAmount={tokensNeeded} includeAO={true} isPrimordial={tokensNeededIsPrimordial} />
                            </Typography>
                        </div>
                        <div className="line-item divider"></div>
                        <div className="line-item">
                            <Typography variant="body1">{tokensNeededIsPrimordial ? `AO+ needed:` : `AO needed`}</Typography>
                            <Typography variant="body1">
                                <TokenBalance baseAmount={tokensNeeded} includeAO={true} isPrimordial={tokensNeededIsPrimordial} />
                            </Typography>
                        </div>
                        <div className={`${classes.contentPaneTriangle} triangle`}></div>
                    </div>
                ) : null}
                <div className="input-pane">
                    {!hideInputTitle ? (
                        <Fragment>
                            <Typography variant="subheading" align="center">{`How much AO+ would you like to purchase?`}</Typography>
                            <Typography variant="caption" align="center" style={{marginBottom: 24}}>{`(as a bonus, an equal amount of AO will be rewarded upon purchase of AO+)`}</Typography>
                        </Fragment>
                    ) : null}                    
                    <div className="input-container">
                        <DenominationInput 
                            ref="tokenInput"
                            baseInputValue={tokensInput}
                            isPrimordial={true}
                            disabled={formDisabled}
                            onChange={this._onInputChange}
                        />
                    </div>
                    <div style={{display: 'flex', marginTop: 24, marginBottom: 24}}>
                        <div className="exchange-remaining">
                            <Typography variant="body1">
                                <TokenBalance baseAmount={icoRemainingSupply} isPrimordial={true} includeAO={true} />
                            </Typography>
                            <Typography variant="caption">{`remaining`}</Typography>
                        </div>
                        <div className="input-cost">
                            <Typography variant="body1">{`cost: ${ethCost.toNumber()} ETH`}</Typography>
                            <Typography variant="caption">{`(1 ${exchangeDenomination.prefix} AO+ = ${exchange.exchangeRate.multipliedBy(Math.pow(10, exchangeDenomination.powerOfTen)).toNumber()} ETH)`}</Typography>
                        </div>
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
                                <Typography color="primary">{`Your exchange was succesful!`}</Typography>
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
                                {'Make another exchange   ↺'}
                            </PrimaryButton>
                        ) : (
                            <PrimaryButton 
                                color="primary" 
                                variant="flat" 
                                fullWidth 
                                onClick={this._handlePurchase}
                                disabled={formDisabled}
                                >
                                {exchangeInProgress ? 'Exchanging...' : 'Exchange tokens'}
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
    withStyles(styles)
)(Exchange)