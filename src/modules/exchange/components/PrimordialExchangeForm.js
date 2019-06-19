import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import withExchangeContainer from "../containers/withExchangeContainer";
import ExchangeForm from "./ExchangeForm";

class PrimordialExchangeForm extends Component {
    componentDidMount() {
        this.props.getPrimordialExchangeRate();
    }
    componentWillReceiveProps(nextProps) {
        if (
            !this.props.contractsInitialized &&
            nextProps.contractsInitialized
        ) {
            this.props.getPrimordialExchangeRate();
        }
    }
    _onSubmit = ({ ethInput }) => {
        this.props.exchangeEthForPrimordialTokens(ethInput);
    };
    render() {
        const { ico } = this.props;
        const maxTokenExchangeAmount = ico.primordialMaxSupply.minus(
            ico.primordialTotalSupply
        );
        return ico.primordialSaleEnded ? (
            <div>
                <Typography variant="body1">
                    {`Thank you for participating in the AO Network Exchange event. This event has now ended.`}
                </Typography>
            </div>
        ) : (
            <ExchangeForm
                onSubmit={this._onSubmit}
                isPrimordialExchange={true}
                exchangeRate={this.props.exchange.primordialExchangeRate}
                maxTokenExchangeAmount={maxTokenExchangeAmount}
            />
        );
    }
}

export default withExchangeContainer(PrimordialExchangeForm);
