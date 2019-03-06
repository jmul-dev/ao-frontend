import { connect } from "react-redux";
import {
    setAccountVideoListingFilter,
    setAccountVideoListingOrdering
} from "../reducers/account.reducer";

const mapDispatchToProps = {
    setAccountVideoListingFilter,
    setAccountVideoListingOrdering
};

const mapStateToProps = state => ({
    ethAddress: state.app.ethAddress,
    filter: state.account.videoListingFilter,
    ordering: state.account.videoListingOrdering
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
);
