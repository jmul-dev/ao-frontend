import gql from "graphql-tag";

export default gql(`
    mutation removeContent($id: ID!) {
        removeContent(id: $id)
    }
`);
