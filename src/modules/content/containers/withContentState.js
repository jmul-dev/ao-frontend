import { graphql } from "react-apollo";
import gql from "graphql-tag";

// Graphql
export const contentStateQuery = gql(`
    query($id: ID!) {
        userContent(id: $id) {
            id
            state
        }
    }
`);

export default graphql(contentStateQuery, {
    name: "contentStateQuery",
    options: ({ content }) => ({
        skip: true, // This query is used to poll after content was submitted, so we skip initial query
        variables: {
            id: content.id
        },
        fetchPolicy: "network-only"
    })
});
