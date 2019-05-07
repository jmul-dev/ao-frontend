import Modal from "@material-ui/core/Modal";
import React, { Component } from "react";
import { LogoIcon } from "../../assets/Icons";
import WriterKeyMismatchForm from "../../modules/writer/components/WriterKeyMismatchForm";
import "./writer-view.css";

export default class WriterView extends Component {
    render() {
        return (
            <Modal
                open={true}
                BackdropProps={{
                    style: { backgroundColor: "rgba(0,0,0,1)" },
                    transitionDuration: 0
                }}
                className="WriterKeyMismatchModal"
            >
                <div className="modal-content-container">
                    <div className="modal-form-container">
                        <LogoIcon style={{ marginBottom: 16 }} />
                        {/* If user has a nameId, show a success view  */}
                        <WriterKeyMismatchForm />
                    </div>
                </div>
            </Modal>
        );
    }
}
