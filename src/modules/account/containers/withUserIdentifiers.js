import { connect } from "react-redux";

const mapStateToProps = state => ({
    ethAddress: state.app.ethAddress,
    aoName: state.app.aoName
});

export default connect(mapStateToProps);
