import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import ContentFields from "../../../graphql/fragments/ContentFields";
import { connect } from "react-redux";
import { getTaoContentState } from "../../account/reducers/account.reducer";

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

const mapDispatchToProps = {
    getTaoContentState
};

const mapStateToProps = (state, props) => ({
    taoContentState: state.account.taoContentState[props.contentId]
});

export default compose(
    graphql(contentQuery, {
        name: "query",
        options: ({ contentId }) => ({
            variables: {
                id: contentId
            }
        })
    }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
);
