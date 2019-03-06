import gql from "graphql-tag";
import ContentFields from "../fragments/ContentFields";

export default gql(`
    mutation ContentBecomeHostTransaction($inputs: ContentHostTransactionInputs!) {
        contentBecomeHostTransaction(inputs: $inputs) {
            ${ContentFields}
        }
    }
`);
