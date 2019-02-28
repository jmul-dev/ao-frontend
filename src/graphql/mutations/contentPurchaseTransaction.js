import gql from "graphql-tag";
import ContentFields from "../fragments/ContentFields";

export default gql(`
    mutation ContentPurchaseTransaction($inputs: ContentPurchaseTransactionInputs!) {
        contentPurchaseTransaction(inputs: $inputs) {
            ${ContentFields}
        }
    }
`);
