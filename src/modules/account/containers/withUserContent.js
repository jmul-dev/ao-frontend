import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import gql from "graphql-tag";
import DatStatsFragment from "../../../graphql/fragments/DatStatsFragment";
import { getContentMetrics } from "../reducers/account.reducer";
import ContentFields from "../../../graphql/fragments/ContentFields";

// GraphQL
const userContent = gql(`
    query {
        node {
            id,
            stakedContent {
                ${ContentFields}
                metadataDatStats {
                    ...DatStatsFragment
                },
                fileDatStats {
                    ...DatStatsFragment
                }
            },
            hostedContent {
                ${ContentFields}
                metadataDatStats {
                    ...DatStatsFragment
                },
                fileDatStats {
                    ...DatStatsFragment
                }
            }
        }
    }
    ${DatStatsFragment}
`);

const mapDispatchToProps = {
    getContentMetrics
};

const mapStateToProps = state => ({
    filter: state.account.videoListingFilter,
    ordering: state.account.videoListingOrdering,
    contentMetrics: state.account.contentMetrics
});

export default compose(
    graphql(userContent, {
        name: "query",
        options: props => ({
            pollInterval: 1500,
            variables: {
                // offset
                // limit
            }
        })
    }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
);
