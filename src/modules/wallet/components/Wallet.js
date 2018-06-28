// @flow
import React, { PureComponent } from 'react';
import { WalletReducerType } from '../reducers/wallet.reducer'
import { AppReducerType } from '../../../store/app.reducer'
import '../styles/wallet.css';

type Props = {
    wallet: WalletReducerType,
    app: AppReducerType,
    getEthBalanceForAccount: (string) => void,
    getTokenBalanceForAccount: (string) => void,
};

export default class Wallet extends PureComponent<Props> {
    props: Props;
    componentDidMount() {
        if ( this.props.app.ethAddress ) {
            this._getUpdatedBalances( this.props.app.ethAddress )
        }
    }
    componentWillReceiveProps(nextProps: Props) {
        if ( this.props.app.ethAddress !== nextProps.app.ethAddress ) {
            this._getUpdatedBalances( nextProps.app.ethAddress )
        }
    }
    _getUpdatedBalances = ( address ) => {
        const { getEthBalanceForAccount, getTokenBalanceForAccount } = this.props
        getEthBalanceForAccount( address )
        getTokenBalanceForAccount( address )
    }
    render() {
        const { ethBalance, tokenBalance } = this.props.wallet
        const { ethAddress } = this.props.app
        return (
            <div className="Wallet">
                {ethAddress ? (
                    <div>
                        <div>Address: {ethAddress}</div>
                        <div>Eth balance: {ethBalance.toNumber()} ETH</div>
                        <div>Token balance: {tokenBalance.toNumber()} AO</div>
                    </div>
                ) : (
                    <div>
                        No account detected
                    </div>
                )}                
            </div>
        );
    }
}
