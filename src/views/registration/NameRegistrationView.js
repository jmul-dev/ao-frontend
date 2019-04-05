import React, { Component } from "react";
import { Route } from "react-router";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Grid from "@material-ui/core/Grid";
import withUserIdentifiers from "../../modules/account/containers/withUserIdentifiers";
import NameRegistrationForm from "../../modules/registration/components/NameRegistrationForm";
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
        const { ethAddress, aoName } = this.props;
        return (
            <Modal
                open={true}
                onClose={this.onClose}
                BackdropProps={{
                    style: { backgroundColor: "rgba(0,0,0,1)" },
                    transitionDuration: 0
                }}
                className="NameRegistrationModal"
            >
                <div className="modal-content-container">
                    <div className="modal-form-container">
                        <LogoIcon style={{ marginBottom: 16 }} />
                        {/* If user has a nameId, show a success view  */}
                        <NameRegistrationForm />
                    </div>
                </div>
            </Modal>
        );
    }
}

export default withUserIdentifiers(NameRegistrationView);
