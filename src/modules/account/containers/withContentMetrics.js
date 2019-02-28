import { connect } from "react-redux";
import {
    getContentMetrics,
    getContentHostEarnings,
    getPurchaseReceipt
} from "../reducers/account.reducer";
import BigNumber from "bignumber.js";

const mapDispatchToProps = {
    getContentMetrics,
    getContentHostEarnings,
    getPurchaseReceipt
};

const mapStateToProps = (state, props) => ({
    metrics: state.account.contentMetrics[props.content.stakeId] || {
        networkTokenStaked: new BigNumber(0),
        primordialTokenStaked: new BigNumber(0),
        primordialTokenStakedWeight: new BigNumber(0),
        totalStakeEarning: new BigNumber(0),
        totalHostEarning: new BigNumber(0),
        totalFoundationEarning: new BigNumber(0)
    },
    contentHostEarnings:
        state.account.contentHostEarnings[props.content.contentHostId] ||
        new BigNumber(0)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
);
