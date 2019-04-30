import ContentFields from "../../graphql/fragments/ContentFields";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

const userContent = gql(`
    query($inputs: UserContentInputs!) {
        node {
            id,
            ethAddress,
            stakedContent(inputs: $inputs) {
                ${ContentFields}
            },
            hostedContent(inputs: $inputs) {
                ${ContentFields}
            }
        }
    }
`);

const dappContentQuery = graphql(userContent, {
    name: "userDappsQuery",
    options: ({ contentType }) => ({
        pollInterval: 5000,
        variables: {
            inputs: {
                contentType: "DAPP"
            }
        }
    })
});

export default dappContentQuery;
