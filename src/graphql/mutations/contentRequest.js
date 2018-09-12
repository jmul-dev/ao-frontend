import gql from "graphql-tag"
import VideoContentFragment from '../fragments/VideoContentFragment'

export default gql(`
    mutation ContentRequest($metadataDatKey: ID!) {
        contentRequest(metadataDatKey: $metadataDatKey) {
            ...VideoContentFragment
        }
    }
    ${VideoContentFragment}
`)