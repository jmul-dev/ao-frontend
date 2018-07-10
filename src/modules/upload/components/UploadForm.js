// @flow
import React, { Component } from 'react';
import { UploadReducerType } from '../reducers/upload.reducer';
import FileUpload from '../components/FileUpload';
import TextInput from '../components/TextInput';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import '../styles/upload-form.css';


type Props = {
    upload: UploadReducerType,
    updateCurrentStep: (number) => void,
};


export default class UploadForm extends Component<Props> {
    props: Props;
    _navToStep = (index) => {
        const { updateCurrentStep } = this.props
        updateCurrentStep(index)
    }
    render() {
        const { currentStepIndex } = this.props.upload
        return (
            <div className="UploadForm">
                {this._renderStep(currentStepIndex)}
            </div>
        );
    }
    _renderStep(index) {
        const { form } = this.props.upload
        switch (index) {
            case 0:
                return (
                    <FileUpload inputName="video" onInputChange={this._navToStep.bind(this, 1)}>
                        <div className="video-input">
                            <Typography variant="display2" gutterBottom align="center">
                                {'drag and drop to upload'}
                            </Typography>
                            <Typography variant="caption" gutterBottom align="center">
                                {'mp4 or mov files'}
                            </Typography>
                            <Button variant="contained" style={{backgroundColor: 'white', marginTop: 24}}>
                                {'or choose a file'}
                            </Button>
                        </div>
                    </FileUpload>
                )
            case 1:
                return (
                    <Grid container spacing={16}>
                        <Grid item xs={4}>
                            <Typography variant="body1">
                                {~~(form.video.size / 1000 / 1000)} MB
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="body1">
                                {'We’ve put together a few options based on your needs:'}
                            </Typography>
                        </Grid>
                    </Grid>                    
                )
            case 2:
                return (
                    <Grid container spacing={16}>
                        <Grid item xs={4}>
                            <FileUpload inputName="videoTeaser" />
                            <FileUpload inputName="featuredImage" />
                        </Grid>                        
                    </Grid>                    
                )
            case 3:
                return (
                    <div>
                        <TextInput inputName="title" inputLabel="Title" />
                        <TextInput inputName="description" inputLabel="Description" />
                    </div>
                )
            default:
                return (
                    <div>{`Current step: ${index}`}</div>
                )
                break;
        }
    }
    _navToSecondInputs = () => {

    }
}