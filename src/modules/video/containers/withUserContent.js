import { connect } from "react-redux";
import { setActiveVideo, getContentPrice } from "../reducers/video.reducer";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import DatStatsFragment from "../../../graphql/fragments/DatStatsFragment";
import { ContentFieldsWithFragments } from "../../../graphql/fragments/ContentFields";

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
    query userContent($id: ID!) {
        userContent(id: $id) {
            ${ContentFieldsWithFragments}
            metadataDatStats {
                ...DatStatsFragment
            },
            fileDatStats {
                ...DatStatsFragment
            },
            taodbValues {
                key,
                value,
                schema,
                label
            }
        }
    }
    ${DatStatsFragment}
`);

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    graphql(userContentQuery, {
        name: "userContentQuery",
        options: ({ contentId }) => ({
            variables: { id: contentId },
            fetchPolicy: "cache-and-network"
        })
    })
);
