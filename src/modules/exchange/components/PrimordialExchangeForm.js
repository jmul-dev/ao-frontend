import React, { Component } from 'react';
import withExchangeContainer from '../containers/withExchangeContainer';
import PropTypes from 'prop-types';
import ExchangeForm from './ExchangeForm';


class PrimordialExchangeForm extends Component {
    _onSubmit = ({ethInput, tokenInput}) => {
        this.props.exchangeEthForPrimordialTokens( parseFloat(ethInput) )
    }
    render() {
        return (
            <ExchangeForm 
                onSubmit={this._onSubmit}
                isNetworkExchange={true}
            />
        )
    }
}


export default withExchangeContainer(PrimordialExchangeForm)
