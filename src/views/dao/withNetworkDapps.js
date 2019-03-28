import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import ContentFields from "../../graphql/fragments/ContentFields";
import DappContentFragment from "../../graphql/fragments/DappContentFragment";

// GraphQL
const networkDappsQuery = gql(`
    query networkDapps($contentType: ContentType!) {
        networkContent(contentType: $contentType) {
            ${ContentFields}
            ${DappContentFragment}
        }
    }
`);

const withNetworkDapps = graphql(networkDappsQuery, {
    name: "networkDappsQuery",
    options: props => ({
        variables: {
            contentType: "DAPP"
        },
        pollInterval: 5000
    })
});

export default withNetworkDapps;
