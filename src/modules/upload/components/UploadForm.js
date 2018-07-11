import React, { Component } from 'react';
import { UploadReducerType } from '../reducers/upload.reducer';
import FileUpload from '../components/FileUpload';
import TextInput from '../components/TextInput';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import withUploadFormData from '../containers/withUploadFormData';



class UploadForm extends Component {
    constructor() {
        super()
        this.state = {
            initialRedirect: false
        }
    }
    _onFileInputChange = (value) => {
        if ( value ) {
            // Nav to next view
            this.props.routerPush('/app/view/upload/pricing')
            this.props.updateLastReachedStep('pricing')
        }
    }
    render() {
        const { form } = this.props
        return (
            <div className="UploadForm">
                <FileUpload inputName="video" onInputChange={this._onFileInputChange}>
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
            </div>
        );
    }
}

export default withUploadFormData(UploadForm);