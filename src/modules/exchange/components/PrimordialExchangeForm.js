import React, { Component } from 'react';
import withExchangeContainer from '../containers/withExchangeContainer';
import PropTypes from 'prop-types';
import ExchangeForm from './ExchangeForm';


class PrimordialExchangeForm extends Component {
    _onSubmit = ({ethInput, tokenInput}) => {
        this.props.exchangeEthForPrimordialTokens( ethInput )
    }
    render() {
        return (
            <ExchangeForm 
                onSubmit={this._onSubmit}
                isNetworkExchange={true}
                exchangeRate={this.props.exchange.primordialExchangeRate}
                initialTokenInput={Math.pow(10, 12) * 10}
            />
        )
    }
}


export default withExchangeContainer(PrimordialExchangeForm)
