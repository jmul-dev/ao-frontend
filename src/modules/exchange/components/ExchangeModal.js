// @flow
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
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
                <div className="modal-content-container" style={{width: 580, position: 'absolute', top: `50%`, left: `50%`, transform: `translate(-50%, -50%)`}}>
                    <div style={{position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -60px)'}}>
                        <LogoIcon />
                    </div>                    
                    <Exchange {...this.props.exchangeProps} />
                </div>
            </Modal>
        );
    }
}
