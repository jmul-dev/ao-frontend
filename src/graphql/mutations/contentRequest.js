import gql from "graphql-tag"
import VideoContentFragment from '../fragments/VideoContentFragment'

export default gql(`
    mutation ContentRequest($id: ID!) {
        contentRequest(id: $id) {
            ...VideoContentFragment
        }
    }
    ${VideoContentFragment}
`)