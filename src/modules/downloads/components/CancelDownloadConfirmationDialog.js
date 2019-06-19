import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

export default function CancelDownloadConfirmationDialog({
    open,
    onConfirm,
    onCancel
}) {
    return (
        <div>
            <Dialog
                open={open}
                onClose={onCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Cancel download?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`Canceling this download will remove it from your local content.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} color="default">
                        back
                    </Button>
                    <IconButton
                        icon="delete"
                        onClick={onConfirm}
                        autoFocus
                        style={{ minWidth: "auto", color: "#f44336" }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}
