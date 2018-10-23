// @flow
import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';
import { LogoIcon } from '../../../assets/Icons';
import NetworkExchangeForm from './NetworkExchangeForm';
import PrimordialExchangeForm from './PrimordialExchangeForm';
import '../styles/exchange.css';


type Props = {
    open: boolean,
    onClose: Function,
    exchangeType: 'network' | 'primordial',
    exchangeProps: Object,
}

export default class ExchangeModal extends Component<Props> {
    props: Props;
    render() {
        return (
            <Modal 
                open={this.props.open}
                onClose={this.props.onClose}
                BackdropProps={{style: {backgroundColor: 'rgba(0,0,0,0.8)'}}}
                className="ExchangeModal"
                >
                <div className="modal-content-container">
                    <LogoIcon />
                    <div className="modal-form-container">
                        {this.props.exchangeType === 'network' && (
                            <NetworkExchangeForm {...this.props.exchangeProps} />
                        )}
                        {this.props.exchangeType === 'primordial' && (
                            <PrimordialExchangeForm {...this.props.exchangeProps} />
                        )}
                    </div>
                </div>
            </Modal>
        );
    }
}
