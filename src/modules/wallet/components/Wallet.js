// @flow
import React, { PureComponent } from 'react';
import { WalletReducerType } from '../reducers/wallet.reducer'
import { AppReducerType } from '../../../store/app.reducer'
import '../styles/wallet.css';

type Props = {
    wallet: WalletReducerType,
    app: AppReducerType,
};

export default class Wallet extends PureComponent<Props> {
    props: Props;
    render() {
        const { ethBalance, tokenBalance } = this.props.wallet
        const { ethAddress } = this.props.app
        return (
            <div className="Wallet">
                <div>Address: {ethAddress}</div>
                <div>Eth balance: {ethBalance.toNumber()} ETH</div>
                <div>Token balance: {tokenBalance.toNumber()} AO</div>
            </div>
        );
    }
}
