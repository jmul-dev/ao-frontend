import React, { Component } from "react";
import { withRouter } from "react-router";
import { compose } from "redux";
import withNameRegistration from "../containers/withNameRegistration";
import withUserIdentifiers from "../../account/containers/withUserIdentifiers";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { PrimaryButton } from "../../../theme";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const styles = () => ({
    form: {
        display: "flex",
        alignItems: "flex-end"
    },
    formHelperText: {
        position: "absolute",
        top: "100%"
    },
    progress: {
        position: "absolute",
        left: 16
    },
    closeButton: {
        position: "absolute",
        top: 32,
        left: 32,
        color: "#999999"
    },
    registrationCompleteContainer: {
        display: "flex",
        alignItems: "center"
    }
});

class NameRegistrationForm extends Component {
    static propTypes = {
        // withRouter
        history: PropTypes.object.isRequired,
        // withNameRegistration
        registerNameUnderEthAddress: PropTypes.func.isRequired,
        registrationState: PropTypes.shape({
            initialized: PropTypes.bool,
            transactionHash: PropTypes.string,
            result: PropTypes.any,
            error: PropTypes.any
        }).isRequired,
        identity: PropTypes.shape({
            node: PropTypes.shape({
                publicKey: PropTypes.string.isRequired
            }).isRequired
        }).isRequired,
        // withUserIdentifiers
        ethAddress: PropTypes.string.isRequired,
        aoName: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string
        }),
        // withStyles
        classes: PropTypes.object.isRequired
    };
    state = {
        nameInput: ""
    };
    _onInputChange = event => {
        this.setState({
            nameInput: event.target.value
        });
    };
    _submit = event => {
        event && event.preventDefault && event.preventDefault();
        const { nameInput } = this.state;
        // Note: input validation occurs in registerNameUnderEthAddress
        this.props.registerNameUnderEthAddress({
            ethAddress: this.props.ethAddress,
            localPublicAddress: this.props.identity.node.publicAddress,
            name: nameInput
        });
    };
    _exitNameRegistration = () => {
        this.props.history.goBack();
    };
    render() {
        const { ethAddress, aoName, registrationState, classes } = this.props;
        const formDisabled =
            registrationState.initialized && !registrationState.error;
        const transactionPending =
            registrationState.transactionHash && !registrationState.result;
        return (
            <div>
                <Typography
                    variant="display2"
                    gutterBottom
                >{`AO Name Registration`}</Typography>
                <Typography variant="body1">
                    {`In order to interact with the AO network, you must first register your Ethereum address. `}
                    {`Name registration provides several important benefits by associating one or more Ethereum accounts with a universal identifier on the AO network. `}
                    {`This allows for decentralized account recovery and mitigates the risk of a single key loss.`}
                </Typography>
                <div style={{ marginTop: 16 }}>
                    {aoName && aoName.nameId ? (
                        <div className={classes.registrationCompleteContainer}>
                            <Typography variant="body1">
                                {`Your registered name, `}
                                <b>{aoName.name}</b>
                                {`, is now associated with the following Ethereum address: ${ethAddress}`}
                            </Typography>
                            <PrimaryButton
                                onClick={this._exitNameRegistration}
                                style={{ marginLeft: 24 }}
                            >{`Done`}</PrimaryButton>
                        </div>
                    ) : (
                        <form onSubmit={this._submit} className={classes.form}>
                            <TextField
                                value={this.state.nameInput}
                                onChange={this._onInputChange}
                                placeholder={`Name for account ${ethAddress}`}
                                label={`Username`}
                                error={!!registrationState.error}
                                helperText={
                                    registrationState.error
                                        ? registrationState.error.message
                                        : ""
                                }
                                FormHelperTextProps={{
                                    className: classes.formHelperText
                                }}
                                fullWidth
                                disabled={formDisabled}
                            />
                            <div
                                style={{ marginLeft: 16, position: "relative" }}
                            >
                                <PrimaryButton
                                    type="submit"
                                    disabled={
                                        formDisabled ||
                                        !this.state.nameInput ||
                                        this.state.nameInput.length < 3 ||
                                        this.state.nameInput.length > 20
                                    }
                                    style={{
                                        visibility: transactionPending
                                            ? "hidden"
                                            : "visible"
                                    }}
                                >{`Submit`}</PrimaryButton>
                                {transactionPending && (
                                    <CircularProgress
                                        className={classes.progress}
                                    />
                                )}
                            </div>
                        </form>
                    )}
                </div>
                <IconButton
                    onClick={this._exitNameRegistration}
                    className={classes.closeButton}
                >
                    <CloseIcon style={{ fontSize: 32 }} />
                </IconButton>
            </div>
        );
    }
}

export default compose(
    withRouter,
    withNameRegistration,
    withUserIdentifiers,
    withStyles(styles)
)(NameRegistrationForm);
