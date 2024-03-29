// @flow
import React, { Component } from "react";
import withUploadFormMutation, {
    UploadFormMutationProps
} from "../containers/withUploadFormMutation";
import { Redirect } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import OverviewAside from "./OverviewAside";
import Grid from "@material-ui/core/Grid";
import CheckIcon from "@material-ui/icons/Check";
import ReplayIcon from "@material-ui/icons/Replay";
import { BackButton, PrimaryButton } from "./UploadFormNavButtons";
import "../styles/upload-form-submit.css";
import { Prompt } from "react-router";
import EtherscanLink from "../../etherscan/EtherscanLink";
import LinearProgress from "@material-ui/core/LinearProgress";
import { isElectron } from "../../../utils/electron";

type Props = {
    // Redux bound state
    form: Object,
    stakeTransaction: {
        initialized: any,
        transactionHash: any,
        result: any,
        error: any
    },
    contentSubmittionResult: any,
    // Redux connected props
    stakeContent: Function,
    setContentSubmittionResult: Function,
    updateLastReachedStep: Function,
    resetUploadForm: Function,
    // Graphql connected props
    ...UploadFormMutationProps
};

class UploadFormSubmit extends Component<Props> {
    props: Props;
    componentDidMount() {
        const {
            updateLastReachedStep,
            form,
            submitContentLoading,
            contentSubmittionResult
        } = this.props;
        updateLastReachedStep("submit");
        if (
            !form.content ||
            (!contentSubmittionResult && !submitContentLoading)
        ) {
            this._submitContent();
        }
    }
    _submitContent = () => {
        const { submitContent, setContentSubmittionResult } = this.props;
        submitContent()
            .then(() => {
                const contentSubmission = this.props.submitContentResult.data
                    .submitContent;
                setContentSubmittionResult(contentSubmission);
                this._stakeContent();
            })
            .catch(error => {
                console.error("Error submitting content:", error);
            });
    };
    _stakeContent = () => {
        const {
            form,
            stakeContent,
            contentSubmittionResult,
            contentUploadStakeTransaction,
            submittedContentQuery
        } = this.props;
        let networkTokenAmount = 0;
        let primordialTokenAmount = form.stake;
        if (form.stakeTokenType === "primordial") {
            networkTokenAmount = 0;
            primordialTokenAmount = form.stake;
        } else if (form.stakeTokenType === "network") {
            networkTokenAmount = form.stake;
            primordialTokenAmount = 0;
        } else if (form.stakeTokenType === "both") {
            // Account for rounding/decimals. Both networkTokenAmount and primordialTokenAmount should be integers.
            networkTokenAmount = Math.floor(
                form.stake * (1 - form.stakePrimordialPercentage / 100)
            );
            primordialTokenAmount = Math.ceil(
                form.stake * (form.stakePrimordialPercentage / 100)
            );
        }
        // 1. Trigger stake tx via metamask
        stakeContent({
            contentLicense: form.contentLicense,
            networkTokenAmount,
            primordialTokenAmount,
            fileDatKey: contentSubmittionResult.fileDatKey,
            metadataDatKey: contentSubmittionResult.metadataDatKey,
            fileSizeInBytes: contentSubmittionResult.fileSize,
            profitPercentage: form.profitSplitPercentage,
            baseChallenge: contentSubmittionResult.baseChallenge,
            encChallenge: contentSubmittionResult.encChallenge,
            taoId: form.taoId
        }).then(transactionHash => {
            // 2. Submit the tx to core
            contentUploadStakeTransaction({
                variables: {
                    inputs: {
                        contentId: contentSubmittionResult.id,
                        transactionHash
                    }
                }
            })
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error(error);
                });
            // 3. Begin polling for content state update
            submittedContentQuery.startPolling(3000);
        });
    };
    _cancel = () => {
        if (this.props.contentSubmittionResult && !isElectron()) {
            if (
                window.confirm(
                    "Are you sure? Your content will be saved, allowing you to stake at a later date."
                )
            ) {
                this._continue();
            }
        } else {
            this.props.history.push("/app/view/upload/content");
        }
    };
    _continue = () => {
        const { submittedContentQuery } = this.props;
        // TODO: these routes change based on content type
        if (submittedContentQuery.userContent)
            this.props.history.push(
                `/app/view/account/${submittedContentQuery.userContent.contentType.toLowerCase()}/${
                    submittedContentQuery.userContent.id
                }`
            );
        else this.props.history.push(`/app/view/account`);
        this.props.resetUploadForm();
    };
    render() {
        const { form, submitContentLoading } = this.props;
        if (!form.content) {
            return <Redirect to={"/app/view/upload/start"} />;
        }
        return (
            <div className="UploadFormSubmit">
                <Typography className="title" variant="subheading">
                    {`Content Upload`}
                </Typography>
                <Grid container spacing={16}>
                    <Grid item xs={3}>
                        <OverviewAside form={form} includePricing={true} />
                    </Grid>
                    <Grid item xs={8} style={{ marginLeft: "auto" }}>
                        <div className="upload-status-container gutter-bottom">
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 36
                                }}
                            >
                                {this._renderUploadState()}
                            </div>
                        </div>
                        <nav className="upload-form-nav gutter-bottom">
                            {this._renderActions()}
                        </nav>
                    </Grid>
                </Grid>
                <Prompt
                    when={submitContentLoading}
                    message={
                        "Leaving now will affect your upload, are you sure?"
                    }
                />
            </div>
        );
    }
    _renderActions() {
        const {
            submitContentResult,
            submitContentLoading,
            submitContentError,
            stakeTransaction,
            submittedContentQuery
        } = this.props;
        const submittedContent =
            submittedContentQuery && submittedContentQuery.userContent
                ? submittedContentQuery.userContent
                : undefined;
        // TODO: use the content.state coming in from submittedContentQuery.data.video.state === 'STAKED' | 'STAKING' | 'DAT_INITIALIZED'
        // logic in reverse order of event occurances
        if (
            submittedContent &&
            (submittedContent.state === "STAKED" ||
                submittedContent.state === "DISCOVERABLE")
        ) {
            return (
                <PrimaryButton onClick={this._continue}>
                    {"continue"}
                </PrimaryButton>
            );
        } else if (stakeTransaction.error) {
            return (
                <React.Fragment>
                    <BackButton onClick={this._cancel}>
                        {"cancel upload"}
                    </BackButton>
                    <PrimaryButton onClick={this._stakeContent}>
                        {"stake content"}
                        <ReplayIcon />
                    </PrimaryButton>
                </React.Fragment>
            );
        } else if (submittedContent && submittedContent.state === "STAKING") {
            return (
                <React.Fragment>
                    <BackButton disabled onClick={this._cancel}>
                        {"cancel upload"}
                    </BackButton>
                </React.Fragment>
            );
        } else if (submitContentResult) {
            return (
                <React.Fragment>
                    <BackButton onClick={this._cancel}>
                        {"cancel upload"}
                    </BackButton>
                    <PrimaryButton onClick={this._stakeContent}>
                        {"stake content"}
                    </PrimaryButton>
                </React.Fragment>
            );
        } else if (submitContentLoading) {
            return (
                <React.Fragment>
                    <BackButton onClick={this._cancel} disabled>
                        {"cancel upload"}
                    </BackButton>
                </React.Fragment>
            );
        } else if (submitContentError) {
            // TODO: allow user to re-submit? Likely a bigger issue though :/
            return (
                <React.Fragment>
                    <BackButton onClick={this._cancel}>
                        {"cancel upload"}
                    </BackButton>
                </React.Fragment>
            );
        } else {
            return null; // ?
        }
    }
    _renderUploadState() {
        const {
            submitContentResult,
            submitContentLoading,
            submitContentError,
            stakeTransaction,
            submittedContentQuery
        } = this.props;
        const submittedContent =
            submittedContentQuery && submittedContentQuery.userContent
                ? submittedContentQuery.userContent
                : undefined;
        const messageStyle = {
            wordWrap: "break-word",
            maxWidth: "100%",
            textAlign: "center",
            maxHeight: "220px",
            overflow: "auto"
        };
        // logic in reverse order of event occurances
        if (submittedContent && submittedContent.state === "STAKED") {
            return (
                <React.Fragment>
                    <Typography variant="body1">
                        {"Content succesfully staked!"}
                    </Typography>
                    <Typography variant="caption" style={messageStyle}>
                        {
                            "You can now view your content and update your staking parameters within your account view."
                        }
                    </Typography>
                </React.Fragment>
            );
        } else if (stakeTransaction.error) {
            return (
                <React.Fragment>
                    <Typography variant="body1">
                        {"Stake transaction error"}
                    </Typography>
                    <Typography variant="caption" style={messageStyle}>
                        {stakeTransaction.error.message}
                    </Typography>
                </React.Fragment>
            );
        } else if (submittedContent && submittedContent.state === "STAKING") {
            return (
                <React.Fragment>
                    <Typography variant="body1">
                        {"Staking transaction in progress..."}
                    </Typography>
                    <Typography variant="caption" style={messageStyle}>
                        <EtherscanLink
                            type="tx"
                            value={stakeTransaction.transactionHash}
                        />
                    </Typography>
                    <LinearProgress
                        color="primary"
                        style={{
                            position: "absolute",
                            bottom: 16,
                            left: 16,
                            right: 16
                        }}
                    />
                </React.Fragment>
            );
        } else if (submitContentResult) {
            return (
                <React.Fragment>
                    <CheckIcon color="primary" style={{ fontSize: 48 }} />
                    <Typography variant="subheading">
                        {"content uploaded"}
                    </Typography>
                </React.Fragment>
            );
        } else if (submitContentLoading) {
            return (
                <React.Fragment>
                    <Typography variant="body1">
                        {"registering content..."}
                    </Typography>
                    <LinearProgress
                        color="primary"
                        style={{
                            position: "absolute",
                            bottom: 16,
                            left: 16,
                            right: 16
                        }}
                    />
                </React.Fragment>
            );
        } else if (submitContentError) {
            return (
                <React.Fragment>
                    <Typography variant="body1">
                        {"Error submitting content"}
                    </Typography>
                    <Typography variant="caption" style={messageStyle}>
                        {submitContentError.message}
                    </Typography>
                </React.Fragment>
            );
        } else {
            return null; // ?
        }
    }
}
export default withUploadFormMutation(UploadFormSubmit);
