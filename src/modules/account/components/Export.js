import React, { Component } from "react";
import withExport from "../containers/withExport";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExportIcon from "@material-ui/icons/Launch";
import { IconButton, Button } from "@material-ui/core";

class Export extends Component {
    static propTypes = {
        mutate: PropTypes.func.isRequired
    };
    constructor() {
        super();
        this.state = {
            dialogOpen: false,
            exporting: false,
            exportError: undefined
        };
    }
    _openDialog = () => {
        this.setState({ dialogOpen: true });
    };
    _closeDialog = () => {
        this.setState({ dialogOpen: false });
    };
    _export = () => {
        this.setState({ exporting: true });
        this.props
            .mutate()
            .then(response => {
                this.setState({ dialogOpen: false, exporting: false });
            })
            .catch(error => {
                this.setState({ exportError: error, exporting: false });
            });
    };
    render() {
        return (
            <div>
                <IconButton onClick={this._openDialog}>
                    <ExportIcon style={{ color: "#333333" }} />
                </IconButton>
                <Dialog
                    open={this.state.dialogOpen}
                    onClose={this._closeDialog}
                >
                    <DialogTitle>{"AO Data Export"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {
                                "This data export mechanism will zip the entire data folder for all users of this AO node. Note that this includes sensitive information including the locally generated private keys for each user. Ideally, this export should be used to transfer your content/identity to another machine. You should find the exported data in a zip folder within your Desktop directory."
                            }
                            {this.state.exportError && (
                                <p style={{ color: "red" }}>{`Export error: ${
                                    this.state.exportError.message
                                }`}</p>
                            )}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this._closeDialog} color="default">
                            Cancel
                        </Button>
                        <Button
                            onClick={this._export}
                            color="primary"
                            disabled={this.state.exporting}
                        >
                            {this.state.exporting ? (
                                <CircularProgress size={20} />
                            ) : (
                                "Export"
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withExport(Export);
