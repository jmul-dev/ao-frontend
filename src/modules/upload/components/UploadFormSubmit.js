// @flow
import React, { Component } from 'react';
import withUploadFormMutation, { UploadFormMutationProps } from '../containers/withUploadFormMutation';
import { Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import OverviewAside from './OverviewAside';
import Grid from '@material-ui/core/Grid';
import { BackButton, PrimaryButton } from './UploadFormNavButtons';
import '../styles/upload-form-submit.css';


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
    componentDidMount() {
        // TODO: check if form is valid
        if ( this.props.form.video ) {
            this.props.triggerStakeTransaction()
        }
    }
    _cancel = () => {

    }
    _continue = () => {

    }
    render() {
        const { submitContentLoading, submitContentError, form } = this.props
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
                        <div>{submitContentLoading ? 'loading' : ''}</div>
                        <div>{submitContentError ? submitContentError.toString() : ''}</div>
                        <button onClick={this.props.submitContent}>submit</button>
                        <nav className="upload-form-nav gutter-bottom">
                            <BackButton onClick={this._cancel}>{'cancel upload'}</BackButton>
                            <PrimaryButton onClick={this._continue}>{'continue'}</PrimaryButton>
                        </nav>
                    </Grid>
                </Grid>
            </div>
        )
    }
}
export default withUploadFormMutation(UploadFormSubmit)