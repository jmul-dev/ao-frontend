// @flow
import React, { Component } from 'react';
import FileUpload from '../components/FileUpload';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withUploadFormData from '../containers/withUploadFormData';
import UnlockIcon from '@material-ui/icons/LockOpen';


type Props = {
    asPlaceholder: boolean,
    updatePricingOption: Function,
    updateLastReachedStep: Function,
    routerPush: Function,
}

class UploadForm extends Component<Props> {
    props: Props;
    constructor() {
        super()
        this.state = {
            initialRedirect: false
        }
    }
    componentDidMount() {
        this.props.resetUploadForm()
    }
    _onFileInputChange = (value) => {
        if ( value ) {
            // Nav to next view
            this.props.updatePricingOption(1)
            this.props.updateLastReachedStep('pricing')
            this.props.routerPush('/app/view/upload/pricing')
        }
    }
    render() {
        const { asPlaceholder } = this.props
        return (
            <div className={`UploadForm ${asPlaceholder ? 'placeholder' : ''}`}>
                <Typography className="title" variant="title" style={{display: 'flex', alignItems: 'flex-end'}}>
                    {`Video Upload`} {asPlaceholder ? (
                        <React.Fragment>
                            <UnlockIcon style={{marginRight: 8, marginLeft: 8}} />
                            <Typography variant="caption" component="span" style={{display: 'inline'}}>{'Unlock your account to proceed'}</Typography>                            
                        </React.Fragment>                        
                    ) : null}
                </Typography>
                <FileUpload disabled={asPlaceholder} inputName="video" onInputChange={this._onFileInputChange}>
                    <div className="video-input" style={{opacity: asPlaceholder ? 0.5 : 1}}>
                        <Typography variant="display2" gutterBottom align="center">
                            {'drag and drop to upload'}
                        </Typography>
                        <Typography variant="caption" gutterBottom align="center">
                            {'mp4 or mov files'}
                        </Typography>
                        <Button disabled={asPlaceholder} variant="contained" style={{backgroundColor: 'white', marginTop: 24}}>
                            {'or choose a file'}
                        </Button>
                    </div>
                </FileUpload>
            </div>
        );
    }
}

export default withUploadFormData(UploadForm);