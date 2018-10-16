import React, { Component } from 'react';
import withExchangeContainer from '../containers/withExchangeContainer';
import PropTypes from 'prop-types';
import ExchangeForm from './ExchangeForm';
import Typography from '@material-ui/core/Typography';


class PrimordialExchangeForm extends Component {
    _onSubmit = ({ethInput, tokenInput}) => {
        this.props.exchangeEthForPrimordialTokens( ethInput )
    }
    render() {
        const { ico } = this.props
        return ico.primordialSaleEnded ? (
            <div>
                <Typography variant="body1">
                    {`Thank you for participating in the AO Network Exchange event. This event has now ended.`}
                </Typography>
            </div>
        ) : (
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
