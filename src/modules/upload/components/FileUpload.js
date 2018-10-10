// @flow
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import withUploadFormValue from '../containers/withUploadFormValue';

type Props = {
    inputName: string,
    inputValue?: any,
    disabled?: boolean,
    accept?: string,
    updateUploadFormField: (string, any) => void,
    onInputChange: (any) => void,
};

const styles = {
    container: {
        position: 'relative',
        overflow: 'hidden',
        width: '100%', 
        border: '1px dashed #333333',
        paddingBottom: '56.25%',
        cursor: 'pointer',
        borderRadius: 4,
    },
    inner: {
        position: 'absolute', 
        top: 0,
        left: 0,
        width: '100%', 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundSize: 'cover',
    },
    videoPreview: {
        position: 'absolute', 
        top: 0,
        left: 0,
        width: '100%',
        height: 'auto',
        background: '#000000',
    }
}

class FileUpload extends Component<Props> {
    props: Props;
    _onDrop = (acceptedFiles, rejectedFiles) => {
        const { updateUploadFormField, inputName, onInputChange } = this.props
        updateUploadFormField(inputName, acceptedFiles[0])
        if ( onInputChange ) onInputChange(acceptedFiles[0])
    }
    render() {
        const { inputValue, disabled, accept, style } = this.props
        let innerStyles = styles.inner
        let videoPreview = null
        if ( inputValue ) {
            if ( inputValue.type.indexOf('video') > -1 ) {
                // We append an actual video element in order to render the preview frame
                videoPreview = (
                    <video src={inputValue.preview} style={styles.videoPreview}></video>
                )
            } else if ( inputValue.type.indexOf('image') > -1 ) {
                // We simply image preview as background of inner container
                innerStyles = Object.assign({}, styles.inner, {backgroundImage: `url(${inputValue.preview})`})
            }
        }       
        const combinedStyles = Object.assign({}, styles.container, style) 
        return (
            <Dropzone disabled={disabled} onDrop={this._onDrop} style={combinedStyles} accept={accept}>
                {videoPreview}
                <div style={innerStyles}>
                    {!inputValue ? this.props.children : null}
                </div>
            </Dropzone>
        )
    }
}
export default withUploadFormValue( FileUpload )