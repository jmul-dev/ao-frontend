import { connect } from "react-redux";
import { getTaoContentState } from "../../account/reducers/account.reducer";

const mapDispatchToProps = {
    getTaoContentState
};

const mapStateToProps = (state, props) => ({
    taoContentState: state.account.taoContentState[props.contentId]
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
);
