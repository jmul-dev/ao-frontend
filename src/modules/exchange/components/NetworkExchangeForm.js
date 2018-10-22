import React, { Component } from 'react';
import withExchangeContainer from '../containers/withExchangeContainer';
import PropTypes from 'prop-types';
import ExchangeForm from './ExchangeForm';
import { compose } from 'react-apollo';
import withExchangePoolsContainer from '../containers/withExchangePoolsContainer';


class NetworkExchangeForm extends Component {
    static defaultProps = {
        requiredTokenAmount: 0,
    }
    componentDidMount() {
        this.props.listenForAvailableExchangePools()
    }
    componentWillUnmount() {
        this.props.stopListeningForAvailableExchangePools()
    }
    _onSubmit = ({ethInput, tokenInput}) => {
        const { targetExchangePool, targetExchangeRate } = this.props
        this.props.exchangeEthForNetworkTokens({
            poolId: targetExchangePool.poolId,
            poolPricePerToken: targetExchangeRate,
            ethCost: ethInput,
            tokenAmount: tokenInput,
        })
    }
    render() {
        const { targetExchangeRate, requiredTokenAmount } = this.props
        return (
            <ExchangeForm 
                onSubmit={this._onSubmit}
                isNetworkExchange={false}
                exchangeRate={targetExchangeRate}
                initialTokenInput={requiredTokenAmount}
            />
        )
    }
}


export default compose(
    withExchangeContainer,
    withExchangePoolsContainer,
)(NetworkExchangeForm)
