import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextInput from './TextInput';
import { AddIcon } from '../../../assets/Icons';
import withUploadFormData from '../containers/withUploadFormData';
import { Redirect } from 'react-router-dom';
import { BackButton, PrimaryButton } from './UploadFormNavButtons';
import OverviewAside from './OverviewAside';
import FileUpload from './FileUpload';


class UploadFormContent extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }    
    componentDidMount() {
        this.props.updateLastReachedStep('content')
    }
    _navBack = () => {
        this.context.router.history.goBack()
    }
    _submit = () => {
        // TODO:
    }
    _onTeaserInputChange = (inputFile) => {
        // TODO: check file size
    }
    _handleTextInput = inputName => event => {
        this.props.updateUploadFormField(inputName, event.target.value)
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
                    <Grid container spacing={24} className="gutter-bottom">
                        <Grid item xs={6}>
                            <Typography variant="body1" gutterBottom>
                                {`featured image (png, jpg)`}
                            </Typography>
                            <FileUpload inputName="featuredImage" accept="image/*">
                                <AddIcon />
                            </FileUpload>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" gutterBottom>
                                {`teaser (mp4, mov)`}
                            </Typography>
                            <FileUpload inputName="videoTeaser" accept="video/*" onInputChange={this._onTeaserInputChange}>
                                <AddIcon />
                            </FileUpload>
                        </Grid>
                    </Grid>
                    <div className="text-inputs gutter-bottom">                    
                        <TextInput
                            value={form.title}
                            onChange={this._handleTextInput("title")}
                            label="video title"
                        />
                        <TextInput
                            value={form.description}
                            onChange={this._handleTextInput("description")}
                            label="description"
                            multiline rows={4}
                        />
                    </div>
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