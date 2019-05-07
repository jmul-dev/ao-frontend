import { connect } from "react-redux";
import {
    addWriterKey,
    writerTransactionReset,
    checkWriterKey
} from "../reducers/writer.reducer";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import { addNotification } from "../../notifications/reducers/notifications.reducer";

const mapStateToProps = state => ({
    transactionState: state.writer.addTransaction,
    ethAddress: state.app.ethAddress
});

const mapDispatchToProps = {
    addWriterKey,
    writerTransactionReset,
    addNotification,
    checkWriterKey
};

const writerKeyQuery = gql(`
    query {
        writerKey
    }
`);

export default compose(
    graphql(writerKeyQuery, {
        name: "writerKeyQuery"
    }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
);
