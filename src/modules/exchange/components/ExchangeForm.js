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
import exchangeIconSrc from '../../../assets/exchange-icon.svg';
import { fromBaseToDenominationValue, fromDenominationValueToBase, fromBaseToHighestDenomination, denominationsByName } from '../../../utils/denominations';


class ExchangeForm extends Component {
    static propTypes = {
        initialTokenInput: PropTypes.number.isRequired,
        isNetworkExchange: PropTypes.bool,
        onSubmit: PropTypes.func.isRequired, // ({ethInput, tokenInputInBaseDenomination})
        // withExchangeContainer
        ethAddress: PropTypes.string,
        wallet: PropTypes.object,
        exchange: PropTypes.object,
        ico: PropTypes.object,
        icoRemainingSupply: PropTypes.instanceOf(BigNumber),
        isElectron: PropTypes.bool,
    }
    static defaultProps = {
        initialTokenInput: Math.pow(11, 12),  // 10 tera ao
        isNetworkExchange: false,
    }
    constructor(props) {
        super(props)
        const { denomination, amount } = fromBaseToHighestDenomination(props.initialTokenInput)
        this.state = {
            ethInput: '0',
            tokenInput: `${amount}`,
            tokenInputDenomination: denomination.name,
            ethUsdExchangeRate: undefined,
        }
    }
    componentDidMount() {
        // Update eth/token inputs based on eth/token exchange rate
    }
    componentDidUpdate(prevProps) {
        if ( this.props.exchange.exchangeRate !== prevProps.exchange.exchangeRate ) {
            // Force recalculation of ETH cost
            this._onTokenInputChange({
                value: this.state.tokenInput,
                denominationName: this.state.tokenInputDenomination,
            })
        }
    }
    _onEthInputChange = ({value}) => {
        const { exchangeRate } = this.props.exchange
        // Eth input changed, we need to convert to AO amount in the current denomination
        let tokenAmountInBaseAo = value / exchangeRate
        console.log(`tokenAmountInBaseAo: ${tokenAmountInBaseAo}`)
        let tokenAmountInCurrentDenom = fromBaseToDenominationValue(tokenAmountInBaseAo, this.state.tokenInputDenomination)
        console.log(`tokenAmountInCurrentDenom ${this.state.tokenInputDenomination}: ${tokenAmountInCurrentDenom}`)
        this.setState({
            ethInput: value,
            tokenInput: tokenAmountInCurrentDenom,
        })        
    }
    _onTokenInputChange = ({value, denominationName}) => {
        const { exchangeRate } = this.props.exchange
        // Token input changed (value or denomination!)
        let tokenAmountInBaseAo = fromDenominationValueToBase(value, denominationName)        
        this.setState({
            tokenInput: value,
            tokenInputDenomination: denominationName,
            ethInput: tokenAmountInBaseAo * exchangeRate
        })
    }
    _submit = (event) => {
        event.preventDefault();
        // TODO: check eth balance sufficient
        this.props.onSubmit({
            ethInput: parseFloat(this.state.ethInput),
            tokenInputInBaseDenomination: fromDenominationValueToBase(this.state.tokenInput, this.state.tokenInputDenomination),
        })
    }
    _reset = () => {
        this.props.resetExchange()
    }
    render() {
        const { ethAddress, isNetworkExchange, exchange, classes } = this.props
        const { exchangeTransaction } = this.props.exchange
        const currentDenomination = denominationsByName[this.state.tokenInputDenomination]
        const exchangeInProgress = exchangeTransaction.initialized && !exchangeTransaction.error
        const formDisabled = !ethAddress || exchangeInProgress || (isNetworkExchange && !this.props.ico.primordialSaleActive)
        const showExchangeTransactionMessage = exchangeTransaction.error || exchangeTransaction.initialized || exchangeTransaction.transactionHash || exchangeTransaction.result
        return (
            <form onSubmit={this._submit} disabled={formDisabled} className={classes.form}>
                <section className={classes.section}>
                    <Typography variant="body2" className={classes.sectionTitle}>{`Ethereum Address`}</Typography>
                    <div className={classes.walletContainer}>
                        <Account display="ethIcon" size={32} className={classes.ethIcon} />
                        <div style={{ opacity: ethAddress ? 1 : 0.5 }}>
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
                            <img src={exchangeIconSrc} alt="exchange icon" />
                        </div>
                        <div className={classes.inputContainer}>
                            <TokenInput
                                label={'RECEIVE'}
                                value={this.state.tokenInput}
                                denominationName={this.state.tokenInputDenomination}
                                onChange={this._onTokenInputChange}
                                disabled={formDisabled}
                                isPrimordial={isNetworkExchange}
                            />
                        </div>
                    </div>
                </section>
                <section className={classes.section}>
                    <Typography variant="body2" className={classes.sectionTitle}>{`Summary`}</Typography>
                    <div className={classes.summaryItem}>
                        <Typography>
                            {`${this.state.tokenInput} ${currentDenomination.prefix} AO${isNetworkExchange ? '+' : ''}`}
                        </Typography>
                        <div className={classes.spacer}></div>
                        <Typography>
                            {`${this.state.ethInput} ETH`}
                        </Typography>
                    </div>
                    {isNetworkExchange ? (
                        <div className={classes.summaryItem}>
                            <Typography color="primary">
                                {`${this.state.tokenInput} ${currentDenomination.prefix} AO (100% Bonus)`}
                            </Typography>
                            <div className={classes.spacer}></div>
                            <Typography>
                                {`${this.state.ethInput} ETH`}
                            </Typography>
                        </div>
                    ) : null}
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
                    disabled={formDisabled}
                    className={classes.actionButton}
                >
                    {exchangeInProgress ? 'Exchanging...' : 'Exchange tokens'}
                    {exchangeInProgress ? (
                        <CircularProgress size={25} style={{position: 'absolute', right: 6}} />
                    ) : null}
                </PrimaryButton>                
                {/* Status */}
                {showExchangeTransactionMessage ? (
                    <div className={classes.txMessage}>
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
            </form>
        )
    }
}

const styles = ({ palette, shape, spacing }) => ({
    form: {
        '&:disabled': {
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
        backgroundColor: '#DEE0E3',
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
    }
})

// export specifically for storybook
export const ExchangeFormWithStyles = withStyles(styles)(ExchangeForm)

export default withExchangeContainer(ExchangeFormWithStyles)

// export default compose(
//     withExchangeContainer,
//     withStyles(styles)
// )(PrimordialExchangeFormWithStyles)