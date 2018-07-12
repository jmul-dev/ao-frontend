// @flow
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import withUploadFormValue from '../containers/withUploadFormValue';

type Props = {
    inputName: string,
    inputValue?: any,
    updateUploadFormField: (string, any) => void,
    onInputChange: (any) => void,
};

const styles = {
    container: {
        position: 'relative',  
        width: '100%', 
        border: '1px dashed #CCCCCC',
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
    },
    innerActive: {
        backgroundSize: 'cover',
        boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)'
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
        const { inputValue } = this.props
        let innerStyles = styles.inner
        if ( inputValue )
            innerStyles = Object.assign({}, innerStyles, styles.innerActive, {backgroundImage: inputValue ? `url(${inputValue.preview})` : ''})
        return (
            <Dropzone onDrop={this._onDrop} style={styles.container} accept={this.props.accept}>
                <div style={innerStyles}>
                    {!inputValue ? this.props.children : null}
                </div>
            </Dropzone>
        )
    }
}
export default withUploadFormValue( FileUpload )