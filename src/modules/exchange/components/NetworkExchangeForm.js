import React, { Component } from 'react';
import withExchangeContainer from '../containers/withExchangeContainer';
import PropTypes from 'prop-types';
import ExchangeForm from './ExchangeForm';
import { compose } from 'react-apollo';
import withExchangePoolsContainer from '../containers/withExchangePoolsContainer';
import BigNumber from 'bignumber.js';


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
        const { targetExchangePool, targetExchangeRate } = this.props
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
