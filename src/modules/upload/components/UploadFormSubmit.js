// @flow
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withUploadFormMutation, { UploadFormMutationProps } from '../containers/withUploadFormMutation';

type Props = {
    form: Object,
    ...UploadFormMutationProps
}

class UploadFormSubmit extends Component<Props> {
    props: Props;
    componentDidMount() {
        // this.props.submitContent()
    }
    render() {
        const { submitContentLoading, submitContentError } = this.props
        return (
            <div>
                <div>Submit</div>
                <div>{submitContentLoading ? 'loading' : ''}</div>
                <div>{submitContentError ? submitContentError.toString() : ''}</div>
                <button onClick={this.props.submitContent}>submit</button>
            </div>
        )
    }
}
export default withUploadFormMutation(UploadFormSubmit)