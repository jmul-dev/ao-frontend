import { graphql } from "react-apollo";
import gql from "graphql-tag";
import DatStatsFragment from "../../../graphql/fragments/DatStatsFragment";

// Graphql
export const contentDownloadStatsQuery = gql(`
    query($id: ID!) {
        userContent(id: $id) {
            id
            fileDatStats {
                ...DatStatsFragment
            }
        }
    }
    ${DatStatsFragment}
`);

export default graphql(contentDownloadStatsQuery, {
    name: "downloadStats",
    options: ({ content }) => ({
        skip: true, // This query is used to poll after content was submitted, so we skip initial query
        variables: {
            id: content.id
        },
        fetchPolicy: "network-only"
    })
});
