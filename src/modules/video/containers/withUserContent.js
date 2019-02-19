import { connect } from "react-redux";
import { setActiveVideo, getContentPrice } from "../reducers/video.reducer";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import VideoContentFragment from "../../../graphql/fragments/VideoContentFragment";
import DatStatsFragment from "../../../graphql/fragments/DatStatsFragment";

// Redux
const mapDispatchToProps = {
    setActiveVideo,
    getContentPrice
};

const mapStateToProps = (store, props) => {
    return {
        networkTokenBalance: store.wallet.networkTokenBalance,
        ethAddress: store.app.ethAddress
    };
};

// GraphQL
export const userContentQuery = gql(`
    query content($id: ID!) {
        userContent(id: $id) {
            ...VideoContentFragment,
            metadataDatStats {
                ...DatStatsFragment
            },
            fileDatStats {
                ...DatStatsFragment
            }
        }
    }
    ${VideoContentFragment}
    ${DatStatsFragment}
`);

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    graphql(userContentQuery, {
        name: "userContentQuery",
        options: ({ id }) => ({
            variables: { id },
            fetchPolicy: "cache-and-network"
        })
    })
);
