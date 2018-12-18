import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextInput from './TextInput';
import { AddIcon } from '../../../assets/Icons';
import withUploadFormData from '../containers/withUploadFormData';
import { Redirect } from 'react-router-dom';
import { BackButton } from './UploadFormNavButtons';
import OverviewAside from './OverviewAside';
import FileUpload from './FileUpload';
import { FileSize } from '../../../utils/denominations';
import { PrimaryButton } from '../../../theme';


const MAX_TEASER_FILE_SIZE_PERCENTAGE = 0.15

class UploadFormContent extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    componentDidMount() {
        this.props.updateLastReachedStep('content')
    }
    _navBack = () => {
        let backRoute = 'pricing'
        if ( this.props.history.location.search && this.props.history.location.search.indexOf('license') > -1 )
            backRoute = 'license'
        this.context.router.history.replace(`/app/view/upload/${backRoute}`)
    }
    _submit = () => {
        this.context.router.history.push('/app/view/upload/submit')
    }
    _onTeaserInputChange = (inputFile) => {
        const maxTeaserFileSize = this.props.form.video.size * MAX_TEASER_FILE_SIZE_PERCENTAGE
        if ( inputFile.size > maxTeaserFileSize ) {
            this.props.updateUploadFormField('videoTeaser', undefined)
            this.props.addNotification({
                message: `Your teaser video is too large. Currently, the network limits teaser video file sizes to <= ${MAX_TEASER_FILE_SIZE_PERCENTAGE * 100}% of the original content upload.`,
                variant: 'warning',
            })
        }
    }
    _handleTextInput = inputName => event => {
        this.props.updateUploadFormField(inputName, event.target.value)
    }
    render() {
        const { form } = this.props
        if ( !form.video ) {
            return <Redirect to={'/app/view/upload/start'} />
        }
        const formIsSubmittable = form.featuredImage && form.videoTeaser && form.title && form.description
        return (
            <div>
                <Typography className="title" variant="subheading">
                    {`Video Upload`}
                </Typography>            
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
                                <FileUpload inputName="featuredImage" accept=".png, .jpg, .jpeg">
                                    <AddIcon />
                                </FileUpload>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" gutterBottom>
                                    {`teaser (mp4, mov) max size = `}<FileSize sizeInBytes={form.video.size * MAX_TEASER_FILE_SIZE_PERCENTAGE} />
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
                            {form.contentLicense === 'TAO' && (
                                <TextInput
                                    value={form.taoId}
                                    onChange={this._handleTextInput("taoId")}
                                    label="TAO ID"
                                />
                            )}
                            {form.contentLicense === 'CC' && (
                                <TextInput
                                    value={form.contentAttribution}
                                    onChange={this._handleTextInput("contentAttribution")}
                                    label="Creative Commons content attribution"
                                />
                            )}
                        </div>
                        <nav className="upload-form-nav gutter-bottom">
                            <BackButton onClick={this._navBack}>{'back'}</BackButton>
                            <PrimaryButton onClick={this._submit} disabled={!formIsSubmittable}>{'finish & upload'}</PrimaryButton>
                        </nav>
                    </Grid>
                </Grid>
            </div>
        )
    }
}
export default withUploadFormData(UploadFormContent)