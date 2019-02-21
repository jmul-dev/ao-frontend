import gql from "graphql-tag";
import VideoContentFragment from "../fragments/VideoContentFragment";
import ContentFields from "../fragments/ContentFields";

export default gql(`
    mutation ContentRequest($metadataDatKey: ID!) {
        contentRequest(metadataDatKey: $metadataDatKey) {
            ${ContentFields}
            ...VideoContentFragment
        }
    }
    ${VideoContentFragment}
`);
