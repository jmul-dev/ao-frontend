import gql from "graphql-tag";
import VideoContentFragment from "../fragments/VideoContentFragment";
import ContentFields from "../fragments/ContentFields";

export default gql(`
    mutation ContentPurchaseTransaction($inputs: ContentPurchaseTransactionInputs!) {
        contentPurchaseTransaction(inputs: $inputs) {
            ${ContentFields}
            ...VideoContentFragment
        }
    }
    ${VideoContentFragment}
`);
