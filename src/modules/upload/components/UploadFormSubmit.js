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


type Props = {
    form: Object,
    stakeTransaction: {
        result: any,
        error: any
    },
    triggerStakeTransaction: Function,
    ...UploadFormMutationProps
}

class UploadFormSubmit extends Component<Props> {
    props: Props;
    _triggerStakeTimeout: number;
    componentDidMount() {
        const { updateLastReachedStep, form, stakeTransaction } = this.props
        updateLastReachedStep('submit')
        // NOTE: need to account for the user coming back to this view after they already started upload process
        // TODO: check if form is valid
        if ( form.video && !stakeTransaction.error && !stakeTransaction.result ) {
            this._triggerStakeTimeout = setTimeout(this._triggerStakeTransaction, 1500)            
        }
    }
    componentWillUnmount() {
        clearTimeout(this._triggerStakeTimeout)
    }
    _triggerStakeTransaction = () => {
        this.props.triggerStakeTransaction().then(result => {
            // Stake successful, proceed to submit content
            this.props.submitContent()
        }).catch(error => {
            
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
        if ( submitContentResult ) {
            return (
                <PrimaryButton onClick={this._continue}>{'continue'}</PrimaryButton>
            )
        } else if ( submitContentLoading ) {
            return (
                <BackButton onClick={this._cancel} disabled>{'cancel upload'}</BackButton>
            )
        } else if ( submitContentError ) {
            // TODO: allow user to re-submit? Likely a bigger issue though :/
            return (
                <BackButton onClick={this._cancel}>{'cancel upload'}</BackButton>
            )
        } else if ( stakeTransaction.result ) {
            return (
                <BackButton onClick={this._cancel}>{'cancel upload'}</BackButton>
            )
        } else if ( stakeTransaction.error ) {
            return (
                <React.Fragment>
                    <BackButton onClick={this._cancel}>{'cancel upload'}</BackButton>
                    <PrimaryButton onClick={this._triggerStakeTransaction}>{'retry'}<ReplayIcon /></PrimaryButton>
                </React.Fragment>
            )
        } else {
            return (
                <BackButton onClick={this._cancel}>{'cancel upload'}</BackButton>
            )
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
        if ( submitContentResult ) {
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
                </React.Fragment>
            )
        } else if ( submitContentError ) {
            return (
                <React.Fragment>
                    <Typography variant="body1">{'Error submitting content'}</Typography>
                    <Typography variant="caption" style={messageStyle}>{submitContentError.message}</Typography>
                </React.Fragment>
            )
        } else if ( stakeTransaction.result ) {
            return (
                <React.Fragment>
                    <Typography variant="body1">{'Stake transaction success'}</Typography>
                    <Typography variant="caption" style={messageStyle}>{stakeTransaction.result}</Typography>
                </React.Fragment>
            )
        } else if ( stakeTransaction.error ) {
            return (
                <React.Fragment>
                    <Typography variant="body1">{'Stake transaction error'}</Typography>
                    <Typography variant="caption" style={messageStyle}>{stakeTransaction.error.message}</Typography>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <Typography variant="body1">{'Waiting for stake transaction...'}</Typography>
                </React.Fragment>
            )
        }
    }
}
export default withUploadFormMutation(UploadFormSubmit)