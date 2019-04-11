import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import { LogoIcon } from "../../../assets/Icons";
import NetworkExchangeForm from "./NetworkExchangeForm";
import PrimordialExchangeForm from "./PrimordialExchangeForm";
import { connect } from "react-redux";
import "../styles/exchange.css";

/*
type Props = {
    open: boolean,
    onClose: Function,
    exchangeType: 'network' | 'primordial' | 'primordialIfActive',
    exchangeProps: Object,
}
*/

class ExchangeModal extends Component {
    render() {
        const { exchangeType, primordialSaleEnded } = this.props;
        let targetExchangeType = exchangeType;
        if (exchangeType === "primordialIfActive" && !primordialSaleEnded) {
            targetExchangeType = "primordial";
        } else if (
            exchangeType === "primordialIfActive" &&
            primordialSaleEnded
        ) {
            targetExchangeType = "network";
        }
        return (
            <Modal
                open={this.props.open}
                onClose={this.props.onClose}
                BackdropProps={{
                    style: { backgroundColor: "rgba(0,0,0,0.8)" }
                }}
                className="ExchangeModal"
            >
                <div className="modal-content-container">
                    <LogoIcon />
                    <div className="modal-form-container">
                        {targetExchangeType === "network" && (
                            <NetworkExchangeForm
                                {...this.props.exchangeProps}
                            />
                        )}
                        {targetExchangeType === "primordial" && (
                            <PrimordialExchangeForm
                                {...this.props.exchangeProps}
                            />
                        )}
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = (store, props) => ({
    primordialSaleEnded: store.ico.primordialSaleEnded
});
export default connect(mapStateToProps)(ExchangeModal);
