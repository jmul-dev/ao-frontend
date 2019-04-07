import { connect } from "react-redux";

const mapStateToProps = state => ({
    theAoDappId: state.contracts.settings.theAoDappId
});

export default connect(mapStateToProps);
