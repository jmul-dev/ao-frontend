import { graphql } from "react-apollo";
import gql from "graphql-tag";
import ContentFields from "../../../graphql/fragments/ContentFields";

// GraphQL
const contentQuery = gql(`
    query($id: ID!) {
        userContent(id: $id) {
            ${ContentFields}
        }
        networkContent(id: $id) {
            ${ContentFields}
        }
    }
`);

export default graphql(contentQuery, {
    name: "query",
    options: ({ contentId }) => ({
        variables: {
            id: contentId
        }
    })
});
