// @flow
import React, { Component } from 'react';
import withUploadFormMutation, { UploadFormMutationProps } from '../containers/withUploadFormMutation';
import { Redirect } from 'react-router-dom';


type Props = {
    form: Object,
    stakeTransaction: {
        result: any,
        error: any
    },
    triggerStakeTransaction: Function,
    ...UploadFormMutationProps
}

class UploadFormSubmit extends Component<Props> {
    props: Props;
    componentDidMount() {
        // TODO: check if form is valid
        if ( this.props.form.video ) {
            this.props.triggerStakeTransaction()
        }
    }
    render() {
        const { submitContentLoading, submitContentError, form } = this.props
        if ( !form.video ) {
            return <Redirect to={'/app/view/upload/start'} />
        }
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