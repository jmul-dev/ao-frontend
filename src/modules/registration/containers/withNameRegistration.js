import { connect } from "react-redux";
import { registerNameUnderEthAddress } from "../../../store/app.reducer";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";

const mapStateToProps = state => ({
    registrationState: state.app.aoNameRegistrationState
});

const mapDispatchToProps = {
    registerNameUnderEthAddress
};

const identityQuery = gql(`
    query {
        node {
            publicAddress
        }
    }
`);

export default compose(
    graphql(identityQuery, {
        name: "identity",
        options: {
            fetchPolicy: "cache-only"
        }
    }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
);
