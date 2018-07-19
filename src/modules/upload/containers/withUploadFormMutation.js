import { graphql, compose } from 'react-apollo';
import withStateMutation from '../../../utils/withStateMutation';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { triggerStakeTransaction, updateLastReachedStep, resetUploadForm } from '../reducers/upload.reducer';


export type UploadFormMutationProps = {
    submitContent: Function,
    submitContentLoading: boolean,
    submitContentError?: Error,
    submitContentResult?: Object,
};

// Redux
const mapDispatchToProps = {
    triggerStakeTransaction,
    updateLastReachedStep,
    resetUploadForm,
}
const mapStateToProps = (store) => {
    return {
        form: store.upload.form,
        stakeTransaction: store.upload.stakeTransaction
    }
}

// Graphql
const submitContentMutation = gql(`
    mutation submitVideoContent($inputs: VideoContentSubmissionInputs) {
        submitVideoContent(inputs: $inputs) {
            id
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
                    pricingOption: undefined // remove from form inputs
                }
            }
        })
    }),
    withStateMutation({name: 'submitContent'})
);