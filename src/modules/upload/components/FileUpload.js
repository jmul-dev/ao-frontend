// @flow
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import withUploadFormValue from '../containers/withUploadFormValue';

type Props = {
    inputName: string,
    inputValue?: any,
    updateUploadFormField: (string, any) => void,
};

class FileUpload extends Component {
    _onDrop = (acceptedFiles, rejectedFiles) => {
        const { updateUploadFormField, inputName } = this.props
        updateUploadFormField(inputName, acceptedFiles[0])
    }
    render() {
        const { inputValue } = this.props
        return inputValue ? (
            <img src={inputValue.preview} width={300} height={'auto'} />
        ) : (
            <Dropzone onDrop={this._onDrop}>
                Upload a file
            </Dropzone>
        );
    }
}
export default withUploadFormValue( FileUpload )