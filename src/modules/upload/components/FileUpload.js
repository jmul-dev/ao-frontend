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

class FileUpload extends Component<Props> {
    props: Props;
    _onDrop = (acceptedFiles, rejectedFiles) => {
        const { updateUploadFormField, inputName, onInputChange } = this.props
        updateUploadFormField(inputName, acceptedFiles[0])
        if ( onInputChange ) onInputChange(acceptedFiles[0])
    }
    render() {
        const { inputValue } = this.props
        return inputValue ? (
            <img alt="preview" src={inputValue.preview} width={300} height={'auto'} />
        ) : (
            <Dropzone onDrop={this._onDrop} style={{width: '100%', border: '1px dashed #CCCCCC'}}>
                {this.props.children}
            </Dropzone>
        );
    }
}
export default withUploadFormValue( FileUpload )