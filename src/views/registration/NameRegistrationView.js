import Modal from "@material-ui/core/Modal";
import React, { Component } from "react";
import { LogoIcon } from "../../assets/Icons";
import NameRegistrationForm from "../../modules/registration/components/NameRegistrationForm";
import "./name-registration-view.css";

export default class NameRegistrationView extends Component {
    render() {
        return (
            <Modal
                open={true}
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
