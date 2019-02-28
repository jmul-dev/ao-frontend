import gql from "graphql-tag";
import ContentFields from "../fragments/ContentFields";

export default gql(`
    query userContent($id: ID!) {
        userContent(id: $id) {
            ${ContentFields}
        }
    }
`);
