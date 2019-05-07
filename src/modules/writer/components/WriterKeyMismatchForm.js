import React, { Component } from "react";
import { withRouter } from "react-router";
import { compose } from "redux";
import withWriterKeyUpdater from "../containers/withWriterKeyUpdater";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { PrimaryButton } from "../../../theme";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const styles = () => ({
    form: {
        display: "flex",
        alignItems: "flex-end",
        position: "relative"
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
    registrationCompleteContainer: {},
    errorMessage: {
        position: "absolute",
        top: "100%",
        marginTop: 16,
        width: `100%`
    }
});

class WriterKeyMismatchForm extends Component {
    static propTypes = {
        // withRouter
        history: PropTypes.object.isRequired,
        // withWriterKeyUpdater
        addWriterKey: PropTypes.func.isRequired,
        writerTransactionReset: PropTypes.func.isRequired,
        checkWriterKey: PropTypes.func.isRequired,
        transactionState: PropTypes.shape({
            initialized: PropTypes.bool,
            transactionHash: PropTypes.string,
            result: PropTypes.any,
            error: PropTypes.any
        }).isRequired,
        writerKeyQuery: PropTypes.shape({
            writerKey: PropTypes.string
        }).isRequired,
        ethAddress: PropTypes.string.isRequired,
        // withStyles
        classes: PropTypes.object.isRequired
    };
    _submit = event => {
        event && event.preventDefault && event.preventDefault();
        this.props.addWriterKey(this.props.writerKeyQuery.writerKey);
    };
    _exit = () => {
        this.props.history.goBack();
    };
    componentWillUnmount() {
        const { transactionState } = this.props;
        const transactionPending =
            transactionState.transactionHash && !transactionState.result;
        if (transactionState.error || !transactionPending) {
            this.props.writerTransactionReset();
        }
    }
    componentDidMount() {
        if (this.props.writerKeyQuery.writerKey) {
            this._checkIfWriterKeyIsAlreadyValid();
        }
    }
    componentDidUpdate(prevProps) {
        if (
            prevProps.writerKeyQuery.writerKey !==
            this.props.writerKeyQuery.writerKey
        ) {
            this._checkIfWriterKeyIsAlreadyValid();
        }
    }
    _checkIfWriterKeyIsAlreadyValid = () => {
        const { checkWriterKey, writerKeyQuery } = this.props;
        checkWriterKey(writerKeyQuery.writerKey)
            .then(writerKeyValid => {
                console.log(`key is valid`);
                if (writerKeyValid) {
                    // writer key is already valid, update state to reflect
                    // really just a safety check
                }
            })
            .catch(error => {
                console.error(error);
            });
    };
    render() {
        const { writerKeyQuery, transactionState, classes } = this.props;
        const formDisabled =
            (transactionState.initialized && !transactionState.error) ||
            !writerKeyQuery.writerKey;
        const transactionPending =
            transactionState.transactionHash && !transactionState.result;
        return (
            <div>
                <Typography
                    variant="display2"
                    gutterBottom
                >{`Identity Association Form`}</Typography>
                <Typography variant="body1">
                    {`Your local AO identity is not registered with the AO smart contracts. In order to continue interacting with the AO network you will need to register your local identity. This allows the network to verify interactions and remain secure.`}
                </Typography>
                <div style={{ marginTop: 16 }}>
                    {transactionState.result ? (
                        <div className={classes.registrationCompleteContainer}>
                            <Typography variant="body1">
                                {`Your local identity is now registered under your name id!`}
                            </Typography>
                            <PrimaryButton
                                onClick={this._exit}
                                style={{ marginTop: 16 }}
                            >{`Done`}</PrimaryButton>
                        </div>
                    ) : (
                        <form onSubmit={this._submit} className={classes.form}>
                            <div>
                                <PrimaryButton
                                    type="submit"
                                    disabled={formDisabled}
                                    style={{
                                        visibility: transactionPending
                                            ? "hidden"
                                            : "visible"
                                    }}
                                >{`Add Identity`}</PrimaryButton>
                                {transactionPending && (
                                    <CircularProgress
                                        className={classes.progress}
                                    />
                                )}
                                {transactionState.error && (
                                    <Typography
                                        variant="caption"
                                        color="error"
                                        className={classes.errorMessage}
                                    >
                                        {transactionState.error.message}
                                    </Typography>
                                )}
                            </div>
                        </form>
                    )}
                </div>
                <IconButton
                    onClick={this._exit}
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
    withWriterKeyUpdater,
    withStyles(styles)
)(WriterKeyMismatchForm);
