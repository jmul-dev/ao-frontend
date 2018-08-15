import { graphql, compose } from 'react-apollo';
import withStateMutation from '../../../utils/withStateMutation';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { stakeContent, setContentSubmittionResult, updateLastReachedStep, resetUploadForm } from '../reducers/upload.reducer';


export type UploadFormMutationProps = {
    submitContent: Function,
    submitContentLoading: boolean,
    submitContentError?: Error,
    submitContentResult?: Object,
};

// Redux
const mapDispatchToProps = {
    stakeContent,
    setContentSubmittionResult,
    updateLastReachedStep,
    resetUploadForm,    
}
const mapStateToProps = (store) => {
    return {
        ethAddress: store.app.ethAddress,
        form: store.upload.form,
        stakeTransaction: store.upload.stakeTransaction,
        contentSubmittionResult: store.upload.contentSubmittionResult,
    }
}

// Graphql
const submitContentMutation = gql(`
    mutation submitVideoContent($inputs: VideoContentSubmissionInputs) {
        submitVideoContent(inputs: $inputs) {
            id, metadataDatKey, fileSize
        }
    }
`)

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    graphql(submitContentMutation, {
        name: 'submitContent',
        // Pull inputs straight from redux props
        options: (props) => ({
            variables: {
                inputs: {                    
                    ...props.form,                    
                    pricingOption: undefined, // remove from form inputs
                    ethAddress: props.ethAddress,
                }
            }
        })
    }),
    withStateMutation({name: 'submitContent'})
);