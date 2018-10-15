import React, { Component } from 'react';
import withExchangeContainer from '../containers/withExchangeContainer';
import PropTypes from 'prop-types';
import ExchangeForm from './ExchangeForm';


class NetworkExchangeForm extends Component {
    _onSubmit = ({ethInput, tokenInput}) => {
        this.props.exchangeEthForNetworkTokens( ethInput )
    }
    render() {
        return (
            <ExchangeForm 
                onSubmit={this._onSubmit}
                isNetworkExchange={false}
                initialTokenInput={/* TODO */}
            />
        )
    }
}


export default withExchangeContainer(NetworkExchangeForm)
