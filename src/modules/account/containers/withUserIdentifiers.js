import { connect } from "react-redux";

const mapStateToProps = state => ({
    ethAddress: state.app.ethAddress,
    aoNameId: state.app.aoNameId
});

export default connect(mapStateToProps);
