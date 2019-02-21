import { graphql, compose } from "react-apollo";
import withStateMutation from "../../../utils/withStateMutation";
import gql from "graphql-tag";
import { connect } from "react-redux";
import {
    stakeContent,
    setContentSubmittionResult,
    updateLastReachedStep,
    resetUploadForm
} from "../reducers/upload.reducer";
import VideoContentFragment from "../../../graphql/fragments/VideoContentFragment";
import userContentQuery from "../../../graphql/queries/userContent";
import ContentFields from "../../../graphql/fragments/ContentFields";

export type UploadFormMutationProps = {
    submitContent: Function,
    submitContentLoading: boolean,
    submitContentError?: Error,
    submitContentResult?: Object,

    contentUploadStakeTransaction: Function,

    submittedContentQuery: Function
};

// Redux
const mapDispatchToProps = {
    stakeContent,
    setContentSubmittionResult,
    updateLastReachedStep,
    resetUploadForm
};
const mapStateToProps = store => {
    return {
        ethAddress: store.app.ethAddress,
        form: store.upload.form,
        stakeTransaction: store.upload.stakeTransaction,
        contentSubmittionResult: store.upload.contentSubmittionResult
    };
};

// Graphql
const submitContentMutation = gql(`
    mutation submitContent($inputs: ContentSubmissionInputs) {
        submitContent(inputs: $inputs) {
            ${ContentFields}
            ...VideoContentFragment
        }
    }
    ${VideoContentFragment}
`);
export const contentUploadStakeTransaction = gql(`
    mutation contentUploadStakeTransaction($inputs: ContentUploadStakeTransactionInputs) {
        contentUploadStakeTransaction(inputs: $inputs) {
            ${ContentFields}
            ...VideoContentFragment
        }
    }
    ${VideoContentFragment}
`);

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    graphql(submitContentMutation, {
        name: "submitContent",
        // Pull inputs straight from redux props
        options: props => ({
            variables: {
                inputs: {
                    ...props.form,
                    ethAddress: props.ethAddress,
                    pricingOption: undefined, // remove from form inputs
                    stakeTokenType: undefined, // remove from form inputs
                    networkTokensRequired: undefined, // remove from form inputs
                    primordialTokensRequired: undefined // remove from form inputs
                }
            }
        })
    }),
    graphql(contentUploadStakeTransaction, {
        name: "contentUploadStakeTransaction"
    }),
    graphql(userContentQuery, {
        name: "submittedContentQuery",
        options: props => ({
            variables: {
                id: props.contentSubmittionResult
                    ? props.contentSubmittionResult.id
                    : undefined
            }
        })
    }),
    withStateMutation({ name: "submitContent" })
);
