import gql from "graphql-tag"
import VideoContentFragment from '../fragments/VideoContentFragment'

export default gql(`
    mutation ContentBecomeHostTransaction($inputs: ContentHostTransactionInputs!) {
        contentBecomeHostTransaction(inputs: $inputs) {
            ...VideoContentFragment
        }
    }
    ${VideoContentFragment}
`)