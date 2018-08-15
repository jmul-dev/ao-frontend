    // @flow
import React, { Component } from 'react';
import withUploadFormMutation, { UploadFormMutationProps } from '../containers/withUploadFormMutation';
import { Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import OverviewAside from './OverviewAside';
import Grid from '@material-ui/core/Grid';
import CheckIcon from '@material-ui/icons/Check';
import ReplayIcon from '@material-ui/icons/Replay';
import { BackButton, PrimaryButton } from './UploadFormNavButtons';
import '../styles/upload-form-submit.css';
import { Prompt } from 'react-router';
import EtherscanLink from '../../etherscan/EtherscanLink';
import LinearProgress from '@material-ui/core/LinearProgress';


type Props = {
    // Redux bound state
    form: Object,
    stakeTransaction: {
        initialized: any,
        transactionHash: any,
        result: any,
        error: any,
    },
    contentSubmittionResult: any,
    // Redux connected props
    stakeContent: Function,
    setContentSubmittionResult: Function,
    updateLastReachedStep: Function,
    resetUploadForm: Function,
    // Graphql connected props
    ...UploadFormMutationProps
}

class UploadFormSubmit extends Component<Props> {
    props: Props;
    componentDidMount() {
        const { updateLastReachedStep, form, stakeTransaction, submitContentLoading, contentSubmittionResult } = this.props
        updateLastReachedStep('submit')
        if ( !form.video || !contentSubmittionResult && !submitContentLoading ) {
            this._submitContent()
        }
    }
    _submitContent = () => {
        const { submitContent, setContentSubmittionResult } = this.props
        submitContent().then(() => {
            const contentSubmission = this.props.submitContentResult.data.submitVideoContent
            setContentSubmittionResult(contentSubmission)        
            this._stakeContent()
        })
    }
    _stakeContent = () => {
        const { form, stakeContent, contentSubmittionResult } = this.props
        stakeContent({
            tokenAmount: form.stake,
            primordialTokenAmount: 0, // TODO
            datKey: contentSubmittionResult.metadataDatKey,
            fileSizeInBytes: contentSubmittionResult.fileSize,
            profitPercentage: form.profit,
        })
    }
    _cancel = () => {
        this.props.history.push('/app/view/upload/content')
    }
    _continue = () => {
        // TODO: where do we go after, account?
        this.props.history.push('/app/view/account')
        this.props.resetUploadForm()
    }
    render() {
        const { form, submitContentLoading, submitContentError } = this.props
        if ( !form.video ) {
            return <Redirect to={'/app/view/upload/start'} />
        }
        return (
            <div className="UploadFormSubmit">
                <Typography className="title" variant="title">
                    {`Video Upload`}
                </Typography>            
                <Grid container spacing={16}>
                    <Grid item xs={3}>
                        <OverviewAside form={form} includePricing={true} />
                    </Grid>
                    <Grid item xs={8} style={{marginLeft: 'auto'}}>
                        <div className="upload-status-container gutter-bottom">
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 36}}>
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
                    message={"Leaving now will affect your upload, are you sure?"}
                />
            </div>
        )
    }
    _renderActions() {
        const { submitContentResult, submitContentLoading, submitContentError, stakeTransaction } = this.props
        // logic in reverse order of event occurances
        if ( stakeTransaction.result ) {
            return (
                <PrimaryButton onClick={this._continue}>{'continue'}</PrimaryButton>
            )
        } else if ( stakeTransaction.error ) {
            return (
                <React.Fragment>
                    <BackButton onClick={this._cancel}>{'cancel upload'}</BackButton>
                    <PrimaryButton onClick={this._stakeContent}>{'stake content'}<ReplayIcon /></PrimaryButton>
                </React.Fragment>
            )
        } else if ( stakeTransaction.transactionHash ) {
            return (
                <React.Fragment>
                    <BackButton disabled onClick={this._cancel}>{'cancel upload'}</BackButton>
                </React.Fragment>
            )
        } else if ( submitContentResult ) {
            return (
                <React.Fragment>
                    <BackButton onClick={this._cancel}>{'cancel upload'}</BackButton>
                    <PrimaryButton onClick={this._stakeContent}>{'stake content'}</PrimaryButton>
                </React.Fragment>
            )
        } else if ( submitContentLoading ) {
            return (
                <React.Fragment>
                    <BackButton onClick={this._cancel} disabled>{'cancel upload'}</BackButton>
                </React.Fragment>
            )
        } else if ( submitContentError ) {
            // TODO: allow user to re-submit? Likely a bigger issue though :/
            return (
                <React.Fragment>
                    <BackButton onClick={this._cancel}>{'cancel upload'}</BackButton>
                </React.Fragment>
            )
        } else {
            return null // ?
        }
    }
    _renderUploadState() {
        const { submitContentResult, submitContentLoading, submitContentError, stakeTransaction } = this.props
        const messageStyle = {
            wordWrap: 'break-word',
            maxWidth: '100%',
            textAlign: 'center',
        }
        // logic in reverse order of event occurances
        if ( stakeTransaction.result ) {
            return (
                <React.Fragment>
                    <Typography variant="body1">{'Content succesfully staked!'}</Typography>
                    <Typography variant="caption" style={messageStyle}>{'You can now view your content and update your staking parameters within your account view.'}</Typography>
                </React.Fragment>
            )
        } else if ( stakeTransaction.error ) {
            return (
                <React.Fragment>
                    <Typography variant="body1">{'Stake transaction error'}</Typography>
                    <Typography variant="caption" style={messageStyle}>{stakeTransaction.error.message}</Typography>
                </React.Fragment>
            )
        } else if ( stakeTransaction.transactionHash ) {
            return (
                <React.Fragment>
                    <Typography variant="body1">{'Staking transaction in progress...'}</Typography>
                    <Typography variant="caption" style={messageStyle}>
                        <EtherscanLink type="tx" value={stakeTransaction.transactionHash} />
                    </Typography>
                    <LinearProgress color="primary" style={{position: 'absolute', bottom: 16, left: 16, right: 16}}/>
                </React.Fragment>
            )
        } else if ( submitContentResult ) {
            return (
                <React.Fragment>
                    <CheckIcon color="primary" style={{ fontSize: 48 }} />
                    <Typography variant="subheading">{'content uploaded'}</Typography>
                </React.Fragment>
            )
        } else if ( submitContentLoading ) {
            return (
                <React.Fragment>
                    <Typography variant="body1">{'registering content...'}</Typography>
                    <LinearProgress color="primary" style={{position: 'absolute', bottom: 16, left: 16, right: 16}}/>
                </React.Fragment>
            )
        } else if ( submitContentError ) {
            return (
                <React.Fragment>
                    <Typography variant="body1">{'Error submitting content'}</Typography>
                    <Typography variant="caption" style={messageStyle}>{submitContentError.message}</Typography>
                </React.Fragment>
            )
        } else {
            return null // ?
        }
    }
}
export default withUploadFormMutation(UploadFormSubmit)