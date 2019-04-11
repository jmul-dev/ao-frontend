import { graphql } from "react-apollo";
import gql from "graphql-tag";
import ContentFields from "../../graphql/fragments/ContentFields";
import DappContentFragment from "../../graphql/fragments/DappContentFragment";

// GraphQL
const networkTaoContentQuery = gql(`
    query networkTaoContentQuery($contentLicense: ContentLicense!) {
        networkContent(contentLicense: $contentLicense) {
            ${ContentFields}
            ${DappContentFragment}
        }
    }
`);

const withNetworkTaoContent = graphql(networkTaoContentQuery, {
    name: "networkTaoContentQuery",
    options: () => ({
        variables: {
            contentLicense: "TAO"
        },
        pollInterval: 5000
    })
});

export default withNetworkTaoContent;
