import gql from "graphql-tag";
import VideoContentFragment from "../fragments/VideoContentFragment";
import ContentFields from "../fragments/ContentFields";

export default gql(`
    mutation contentRetryHostDiscovery($id: ID!) {
        contentRetryHostDiscovery(id: $id) {
            ${ContentFields}
            ...VideoContentFragment
        }
    }
    ${VideoContentFragment}
`);
