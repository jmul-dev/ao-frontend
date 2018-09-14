import gql from "graphql-tag"
import VideoContentFragment from '../fragments/VideoContentFragment'

export default gql(`
    mutation contentRetryHostDiscovery($id: ID!) {
        contentRetryHostDiscovery(id: $id) {
            ...VideoContentFragment
        }
    }
    ${VideoContentFragment}
`)