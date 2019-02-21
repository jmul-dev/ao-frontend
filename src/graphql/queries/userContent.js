import gql from "graphql-tag";
import VideoContentFragment from "../fragments/VideoContentFragment";
import ContentFields from "../fragments/ContentFields";

export default gql(`
    query userContent($id: ID!) {
        userContent(id: $id) {
            ${ContentFields}
            ...VideoContentFragment
        }
    }
    ${VideoContentFragment}
`);
