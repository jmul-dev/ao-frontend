// @flow
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import withUploadFormValue from '../containers/withUploadFormValue';

type Props = {
    inputName: string,
    inputValue?: string,
    inputLabel?: string,
    updateUploadFormField: (string, any) => void,
};

class TextInput extends Component {
    _onChange = (event) => {
        const { updateUploadFormField, inputName } = this.props
        // TODO: validate input?
        updateUploadFormField( inputName, event.target.value )
    }
    render() {
        const { inputName, inputValue, inputLabel } = this.props
        return (
            <TextField 
                value={inputValue}
                onChange={this._onChange}
                label={inputLabel}
            />
        )
    }
}
export default withUploadFormValue( TextInput )