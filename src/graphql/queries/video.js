import gql from 'graphql-tag';
import VideoContentFragment from '../fragments/VideoContentFragment';

export default gql(`
    query video($id: ID!) {
        video(id: $id) {
            ...VideoContentFragment
        }
    }
    ${VideoContentFragment}
`)