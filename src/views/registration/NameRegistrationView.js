import React, { Component } from "react";
import { Route } from "react-router";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Grid from "@material-ui/core/Grid";
import withEthAddress from "../../modules/account/containers/withEthAddress";
import { LogoIcon } from "../../assets/Icons";
import "./name-registration-view.css";

class NameRegistrationView extends Component {
    state = { open: true };
    onClose = () => {
        this.setState({
            open: false
        });
    };
    render() {
        const { ethAddress } = this.props;
        return (
            <Modal
                open={true}
                onClose={this.onClose}
                BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,1)" } }}
                className="RegistrationModal"
            >
                <div className="modal-content-container">
                    <div>
                        <LogoIcon />
                        <div className="modal-form-container">"TODO"</div>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default withEthAddress(NameRegistrationView);
