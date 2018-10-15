/**
 * Functional component useful for accessing/rendering wallet balance:
 * Ex: <WalletBalances>{({primordialTokenBalance, networkTokenBalance, ethBalance}) => ()}</WalletBalances>
 */
import React, { PureComponent } from 'react';
import withUserWallet from '../containers/withUserWallet';
import { formattedTokenAmount, TokenBalance } from '../../../utils/denominations';
import PropTypes from 'prop-types';


class WalletBalances extends PureComponent {
    static propTypes = {
        // ({ primordialBalance, networkBalance })
        children: PropTypes.func.isRequired,
    }
    componentDidMount() {
        if ( this.props.ethAddress ) {
            this._getUpdatedBalances()
        }
    }
    componentWillReceiveProps(nextProps: Props) {
        if ( this.props.ethAddress !== nextProps.ethAddress ) {
            this._getUpdatedBalances()
        }
    }
    _getUpdatedBalances = () => {
        const { updateWallet } = this.props
        updateWallet()
    }
    render() {
        const { primordialTokenBalance, networkTokenBalance, ethBalance } = this.props.wallet
        const networkTokenBalanceFormatted = <TokenBalance baseAmount={networkTokenBalance} includeAO={true} isPrimordial={false} />
        const primordialTokenBalanceFormatted = <TokenBalance baseAmount={primordialTokenBalance} includeAO={true} isPrimordial={true} />
        return this.props.children({
            primordialTokenBalance,
            primordialTokenBalanceFormatted,
            networkTokenBalance,
            networkTokenBalanceFormatted,
            ethBalance,
        })
    }
}
export default withUserWallet(WalletBalances)