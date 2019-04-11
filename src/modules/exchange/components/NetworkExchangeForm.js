import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import withExchangeContainer from '../containers/withExchangeContainer';
import withExchangePoolsContainer from '../containers/withExchangePoolsContainer';
import ExchangeForm from './ExchangeForm';


class NetworkExchangeForm extends Component {
    static defaultProps = {
        requiredTokenAmount: Math.pow(10, 9),
    }
    componentDidMount() {
        this.props.listenForAvailableExchangePools()
    }
    componentWillUnmount() {
        this.props.stopListeningForAvailableExchangePools()
    }
    _onSubmit = ({ethInput, tokenInputInBaseDenomination}) => {
        const { targetExchangePool } = this.props
        this.props.exchangeEthForNetworkTokens({
            poolId: targetExchangePool.poolId,
            poolPrice: targetExchangePool.price,
            ethCost: ethInput,
            tokenAmount: tokenInputInBaseDenomination,
        })
    }
    render() {
        const { targetExchangePool, targetExchangeRate, requiredTokenAmount } = this.props
        return (
            <ExchangeForm 
                onSubmit={this._onSubmit}
                isPrimordialExchange={false}
                exchangeRate={targetExchangeRate}
                initialTokenInput={requiredTokenAmount}
                maxTokenExchangeAmount={targetExchangePool ? targetExchangePool.totalQuantityAvailable : new BigNumber(0)}
            />
        )
    }
}


export default compose(
    withExchangeContainer,
    withExchangePoolsContainer,
)(NetworkExchangeForm)
