import React, { Component, Fragment } from 'react';
import withExchangeContainer from '../containers/withExchangeContainer';
import Typography from '@material-ui/core/Typography';
import { PrimaryButton } from '../../../theme';
import CircularProgress from '@material-ui/core/CircularProgress';
import EtherscanLink from '../../etherscan/EtherscanLink';
import Account from '../../account/components/Account';
import { TokenInput, EthereumInput } from '../../../common/Inputs';
import BigNumber from 'bignumber.js';
import { compose } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import WalletBalances from '../../wallet/components/WalletBalances';
import { fromBaseToDenominationValue, fromDenominationValueToBase, fromBaseToHighestDenomination, denominationsByName, TokenBalance } from '../../../utils/denominations';


class ExchangeForm extends Component {
    static propTypes = {
        initialTokenInput: PropTypes.number.isRequired,
        isPrimordialExchange: PropTypes.bool,
        onSubmit: PropTypes.func.isRequired, // ({ethInput, tokenInputInBaseDenomination})
        exchangeRate: PropTypes.instanceOf(BigNumber),
        maxTokenExchangeAmount: PropTypes.instanceOf(BigNumber),
        // withExchangeContainer
        contractsInitialized: PropTypes.bool,
        ethAddress: PropTypes.string,
        wallet: PropTypes.object,
        exchange: PropTypes.object,
        ico: PropTypes.object,
        icoRemainingSupply: PropTypes.instanceOf(BigNumber),
        isElectron: PropTypes.bool,
        calculatePrimoridialExchangeMultiplierAndBonus: PropTypes.func.isRequired,
    }
    static defaultProps = {
        initialTokenInput: Math.pow(10, 12) * 10,  // 10 tera ao
        isPrimordialExchange: false,
    }
    constructor(props) {
        super(props)
        const { denomination, amount } = fromBaseToHighestDenomination(props.initialTokenInput)
        this.state = {
            ethInput: '0.1',
            tokenInput: `${amount}`,
            tokenInputDenomination: denomination.name,
            tokenInputBaseAo: new BigNumber(props.initialTokenInput),
            ethUsdExchangeRate: undefined,
            primordialExchangeBonuses: undefined,
        }
    }
    componentDidMount() {
        this.props.updateCurrentExchangeAmountInBaseAo(this.state.tokenInputBaseAo)
        this._inputChangeRecalculations(this.state.tokenInputBaseAo)
    }
    componentDidUpdate(prevProps) {
        if ( !this.props.exchangeRate.isEqualTo(prevProps.exchangeRate) ) {
            // Force recalculation of ETH cost
            this._onTokenInputChange({
                value: this.state.tokenInput,
                denominationName: this.state.tokenInputDenomination,
            })
        }
    }
    _onEthInputChange = ({value}) => {
        const { exchangeRate } = this.props
        // Eth input changed, we need to convert to AO amount in the current denomination
        let tokenAmountInBaseAo = new BigNumber(value).dividedBy(exchangeRate)
        let tokenAmountInCurrentDenom = fromBaseToDenominationValue(tokenAmountInBaseAo, this.state.tokenInputDenomination)
        this._inputChangeRecalculations(tokenAmountInBaseAo)
        this.setState({
            ethInput: value,
            tokenInput: tokenAmountInCurrentDenom,
            tokenInputBaseAo: tokenAmountInBaseAo,
        })
    }
    _onTokenInputChange = ({value, denominationName}) => {
        const { exchangeRate } = this.props
        // Token input changed (value or denomination!)
        let tokenAmountInBaseAo = fromDenominationValueToBase(new BigNumber(value), denominationName)
        this._inputChangeRecalculations(tokenAmountInBaseAo)
        this.setState({
            tokenInput: value,
            tokenInputBaseAo: tokenAmountInBaseAo,
            tokenInputDenomination: denominationName,
            ethInput: tokenAmountInBaseAo * exchangeRate
        })
    }
    _inputChangeRecalculations = (baseTokenAmount) => {
        if ( this.props.isPrimordialExchange ) {
            // Primordial exchange -> recalculate the exchange multiplier/bonus
            this.props.calculatePrimoridialExchangeMultiplierAndBonus(baseTokenAmount).then(bonuses => {
                this.setState({
                    primordialExchangeBonuses: bonuses,                    
                })
            }).catch(error => {
                console.error(`Error fetching primordial exchange bonuses:`, error)
            })
        } else {
            // Network exchange -> update exchange amount in reducer so we can recaulculate the best exchange pool
            this.props.updateCurrentExchangeAmountInBaseAo(baseTokenAmount)
        }
    }
    _submit = (event) => {
        event.preventDefault();
        // TODO: check eth balance sufficient
        this.props.onSubmit({
            ethInput: parseFloat(this.state.ethInput),
            tokenInputInBaseDenomination: fromDenominationValueToBase(new BigNumber(this.state.tokenInput), this.state.tokenInputDenomination),
        })
    }
    _reset = () => {
        this.props.resetExchange()
    }
    render() {
        const { ethAddress, isPrimordialExchange, exchange, exchangeRate, classes } = this.props
        const { exchangeTransaction } = this.props.exchange
        const { primordialExchangeBonuses } = this.state
        const currentDenomination = denominationsByName[this.state.tokenInputDenomination]
        const exchangeInProgress = exchangeTransaction.initialized && !exchangeTransaction.error && !exchangeTransaction.result
        const formDisabled = !ethAddress || exchangeInProgress || (isPrimordialExchange && !this.props.ico.primordialSaleActive) || exchangeRate.lte(0)
        const showExchangeTransactionMessage = exchangeTransaction.error || exchangeTransaction.initialized || exchangeTransaction.transactionHash || exchangeTransaction.result
        return (
            <form onSubmit={this._submit} disabled={formDisabled} className={classes.form}>
                <section className={classes.section}>
                    <Typography variant="body2" className={classes.sectionTitle}>{`Ethereum Address`}</Typography>
                    <div className={classes.walletContainer}>
                        <Account display="ethIcon" size={32} className={classes.ethIcon} />
                        <div style={{opacity: ethAddress ? 1 : 0.5}}>
                            <Typography variant="body1" component="span">
                                <b>{'id:'}</b> <Account display="ethAddress" />
                            </Typography>
                            <div>
                                <WalletBalances>{({ primordialTokenBalance, networkTokenBalance, ethBalance }) => (
                                    <Typography variant="body1"><b>{`${ethBalance.toFixed(3)} ETH`}</b></Typography>
                                )}</WalletBalances>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={classes.section}>
                    <Typography variant="body2" className={classes.sectionTitle}>{`Amount`}</Typography>
                    <div className={classes.inputsContainer}>
                        <div className={classes.inputContainer}>
                            <EthereumInput
                                label={`SEND`}
                                value={this.state.ethInput}
                                onChange={this._onEthInputChange}
                                disabled={formDisabled}
                            />
                        </div>
                        <div className={classes.exchangeIconContainer}>
                            <img alt="exchange icon" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyNnB4IiBoZWlnaHQ9IjE3cHgiIHZpZXdCb3g9IjAgMCAyNiAxNyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5leGNoYW5nZS1pY29uPC90aXRsZT4gICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+ICAgIDxnIGlkPSJleGNoYW5nZS1pY29uIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxnIGlkPSJHcm91cC0xNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4wMDAwMDAsIDEuMDAwMDAwKSIgc3Ryb2tlPSIjNzc3Nzc3Ij4gICAgICAgICAgICA8cG9seWxpbmUgaWQ9IlBhdGgiIHBvaW50cz0iMCA1IDI0IDUgMTguNzg5Nzg2MSAwIj48L3BvbHlsaW5lPiAgICAgICAgICAgIDxwb2x5bGluZSBpZD0iUGF0aCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIuMDAwMDAwLCAxMi41MDAwMDApIHJvdGF0ZSgtMTgwLjAwMDAwMCkgdHJhbnNsYXRlKC0xMi4wMDAwMDAsIC0xMi41MDAwMDApICIgcG9pbnRzPSIwIDE1IDI0IDE1IDE4Ljc4OTc4NjEgMTAiPjwvcG9seWxpbmU+ICAgICAgICA8L2c+ICAgIDwvZz48L3N2Zz4=" />
                        </div>
                        <div className={classes.inputContainer}>
                            <TokenInput
                                label={'RECEIVE'}
                                value={this.state.tokenInput}
                                denominationName={this.state.tokenInputDenomination}
                                onChange={this._onTokenInputChange}
                                disabled={formDisabled}
                                isPrimordial={isPrimordialExchange}
                                supplementalText={isPrimordialExchange && primordialExchangeBonuses ? `multiplier = ${primordialExchangeBonuses.multiplier}` : undefined}
                            />
                        </div>
                        {this.state.tokenInputBaseAo.gt(this.props.maxTokenExchangeAmount) && (
                            <Typography color="error" variant="caption" className={classes.maxExchangeAmountExceeded}>
                                {isPrimordialExchange ? 'Remaining supply: ' : `Maximum exchange amount: `}<TokenBalance baseAmount={this.props.maxTokenExchangeAmount} includeAO={true} isPrimordial={isPrimordialExchange} />
                            </Typography>
                        )}
                    </div>
                </section>
                <section className={classes.section}>
                    <Typography variant="body2" className={classes.sectionTitle}>{`Summary`}</Typography>
                    <div className={classes.summaryItem}>
                        <Typography>
                            {`${this.state.tokenInput} ${currentDenomination.prefix} AO${isPrimordialExchange ? '+' : ''}`}
                        </Typography>
                        <div className={classes.spacer}></div>
                        <Typography>
                            {`${this.state.ethInput} ETH`}
                        </Typography>
                    </div>
                    {isPrimordialExchange && primordialExchangeBonuses && (
                        <div className={classes.summaryItem}>
                            <Typography color="primary">
                                <TokenBalance baseAmount={primordialExchangeBonuses.networkTokenBonusAmount} includeAO={true} isPrimordial={false} />{` (${primordialExchangeBonuses.bonusPercentage}% Bonus)`}
                            </Typography>
                            <div className={classes.spacer}></div>
                            <Typography>
                                {`FREE`}
                            </Typography>
                        </div>
                    )}
                    <div className={classes.summaryItem}>
                        <Typography>
                            {'Total'}
                        </Typography>
                        <div className={classes.spacer}></div>
                        <Typography>
                            <b>{`${this.state.ethInput} ETH`}</b>
                        </Typography>
                    </div>
                </section>
                {/* Action */}
                <PrimaryButton
                    fullWidth
                    onClick={exchangeTransaction.result ? this._reset : this._submit}
                    disabled={exchangeTransaction.result ? false : formDisabled}
                    className={classes.actionButton}
                >
                    {exchangeTransaction.result ? 'Make another exchange   ↺' : (
                        <span>{exchangeInProgress ? 'Exchanging...' : 'Exchange tokens'}</span>
                    )}
                    {exchangeInProgress ? (
                        <CircularProgress size={25} style={{position: 'absolute', right: 6}} />
                    ) : null}
                </PrimaryButton>
                {/* Status */}
                {showExchangeTransactionMessage ? (
                    <div className={classes.txMessage}>
                        {exchangeTransaction.error ? (
                            <Typography color="error" className={classes.errorMessage}>{exchangeTransaction.error.message}</Typography>                                
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
            </form>
        )
    }
}

const styles = ({ palette, shape, spacing }) => ({
    form: {
        textAlign: 'left',
        '&[disabled]': {
            opacity: 0.5,
        }
    },
    section: {
        marginBottom: spacing.unit * 3
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: spacing.unit,
    },
    walletContainer: {
        backgroundColor: palette.type === 'light' ? '#DEE0E3' : '#333333',
        borderRadius: shape.borderRadius,
        padding: `${spacing.unit}px ${spacing.unit * 2}px`,
        display: 'flex',
        alignItems: 'center',
    },
    ethIcon: {
        marginRight: spacing.unit
    },
    inputsContainer: {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
    },
    inputContainer: {
        flex: 1,
    },
    exchangeIconContainer: {
        marginLeft: spacing.unit * 2,
        marginRight: spacing.unit * 2,
    },
    summaryItem: {
        display: 'flex',
        alignItems: 'baseline',
        marginBottom: spacing.unit / 2,
    },
    spacer: {
        flex: 1,
        borderBottom: `1px dashed #CCCCCC`,
        marginLeft: spacing.unit,
        marginRight: spacing.unit,
    },
    txMessage: {
        marginTop: spacing.unit * 2,
        textAlign: 'right',
    },
    actionButton: {
        position: 'relative',
    },
    errorMessage: {
        // account for very long error messages...
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
    maxExchangeAmountExceeded: {
        position: 'absolute',
        top: `calc(100% + 4px)`,
        right: 0,
    },
})

// export specifically for storybook
export const ExchangeFormWithStyles = withStyles(styles)(ExchangeForm)

export default withExchangeContainer(ExchangeFormWithStyles)

// export default compose(
//     withExchangeContainer,
//     withStyles(styles)
// )(PrimordialExchangeFormWithStyles)