import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import withUploadFormData from '../containers/withUploadFormData';
import { Redirect } from 'react-router-dom';
import { BackButton, PrimaryButton } from './UploadFormNavButtons';
import OverviewAside from './OverviewAside';


class UploadFormContent extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }    
    _navBack = () => {
        this.context.router.history.goBack()
    }
    _submit = () => {
        
    }
    render() {
        const { form, router } = this.props
        if ( !form.video ) {
            return <Redirect to={'/app/view/upload/start'} />
        }
        const fileSizeInMb = ~~(form.video.size / 1000 / 1000)
        return (
            <Grid container spacing={16}>
                <Grid item xs={3}>
                    <OverviewAside form={form} includePricing={true} />
                </Grid>
                <Grid item xs={8} style={{marginLeft: 'auto'}}>                    
                    
                    <nav className="upload-form-nav gutter-bottom">
                        <BackButton onClick={this._navBack}>{'back'}</BackButton>
                        <PrimaryButton onClick={this._submit}>{'finish & upload'}</PrimaryButton>
                    </nav>
                </Grid>
            </Grid>   
        )
    }
}
export default withUploadFormData(UploadFormContent)