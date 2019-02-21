import { connect } from "react-redux";
import { setActiveVideo, getContentPrice } from "../reducers/video.reducer";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import VideoContentFragment from "../../../graphql/fragments/VideoContentFragment";
import DatStatsFragment from "../../../graphql/fragments/DatStatsFragment";
import ContentFields from "../../../graphql/fragments/ContentFields";

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
            ${ContentFields}
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
        options: ({ contentId }) => ({
            variables: { id: contentId },
            fetchPolicy: "cache-and-network"
        })
    })
);
