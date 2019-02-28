/**
 * withIncompleteHostedContent
 *
 * Slightly verbose name, but essentially this is a list of content
 * that the users has begun pulling into their node (purchasing) but
 * has not finished the process (re-hosting)
 */
import { connect } from "react-redux";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import ContentFields from "../../../graphql/fragments/ContentFields";

// Redux
const mapDispatchToProps = {};

const mapStateToProps = store => {
    return {
        recentlyHostedContentIds: store.video.recentlyHostedContentIds
    };
};

// GraphQL
const hostedContentQuery = gql(`
    query {
        node {
            id,
            hostedContent {
                ${ContentFields}
            }
        }
    }
`);

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    graphql(hostedContentQuery, {
        name: "hostedContentQuery"
    })
);
