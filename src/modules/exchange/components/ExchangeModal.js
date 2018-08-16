// @flow
import React, { Component } from 'react';
import Exchange from './Exchange';
import Modal from '@material-ui/core/Modal';
import { LogoIcon } from '../../../assets/Icons';


type Props = {
    open: boolean,
    onClose: Function,
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
                    <Exchange {...this.props.exchangeProps} />
                </div>
            </Modal>
        );
    }
}
