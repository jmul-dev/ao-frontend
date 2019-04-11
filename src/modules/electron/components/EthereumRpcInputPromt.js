import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import React, { Component } from "react";
import withEthereumRpcPrompt from "../containers/withEthereumRpcPrompt";

class EthereumRpcInputPrompt extends Component {
    static propTypes = {
        ethRpcPrompt: PropTypes.shape({
            lastUsedRpcEndpoint: PropTypes.string
        }),
        // redux
        submitEthereumRpcValue: PropTypes.func.isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            rpcInput: "",
            rpcInputError: undefined
        };
    }
    componentDidUpdate() {
        if (this.props.ethRpcPrompt && !this.state.rpcInput) {
            this.setState({
                rpcInput: this.props.ethRpcPrompt.lastUsedRpcEndpoint
            });
        }
    }
    _onRpcInputChange = event => {
        let inputValue = event.target.value;
        this.setState({
            rpcInput: inputValue
        });
    };
    _submitRpcEndpoint = () => {
        const rpcInput = this.state.rpcInput;
        let matches = rpcInput.match(/^(wss:\/\/|ws:\/\/)/);
        if (matches && matches.length > 0) {
            this.props.submitEthereumRpcValue(rpcInput);
            this.setState({ rpcInputError: undefined });
        } else {
            this.setState({
                rpcInputError: `Please provide an rpc websocket endpoint in the form of wss:// or ws://`
            });
        }
    };
    render() {
        const { ethRpcPrompt } = this.props;
        return (
            <Dialog
                open={!!ethRpcPrompt}
                aria-labelledby="ethereum-rpc-prompt-title"
            >
                <DialogTitle id="ethereum-rpc-prompt-title">
                    Ethereum RPC
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {`AO was unable to connect to the Ethereum network over the following RPC endpoint:`}
                        <Typography
                            dispaly="inline"
                            color="error"
                            gutterBottom
                            style={{ marginLeft: 8 }}
                        >
                            {ethRpcPrompt
                                ? ethRpcPrompt.lastUsedRpcEndpoint
                                : ""}
                        </Typography>
                    </Typography>
                    <TextField
                        value={this.state.rpcInput}
                        onChange={this._onRpcInputChange}
                        autoFocus
                        label="Ethereum RPC"
                        type="text"
                        fullWidth
                        error={!!this.state.rpcInputError}
                        helperText={
                            this.state.rpcInputError ||
                            "AO requires a websocket connection to the ethereum RPC"
                        }
                        style={{ marginTop: 32 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this._submitRpcEndpoint} color="primary">
                        Retry
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withEthereumRpcPrompt(EthereumRpcInputPrompt);
