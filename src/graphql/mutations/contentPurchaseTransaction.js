import gql from "graphql-tag"
import VideoContentFragment from '../fragments/VideoContentFragment'

export default gql(`
    mutation ContentPurchaseTransaction($inputs: ContentPurchaseTransactionInputs!) {
        contentPurchaseTransaction(inputs: $inputs) {
            ...VideoContentFragment
        }
    }
    ${VideoContentFragment}
`)