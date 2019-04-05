import { connect } from "react-redux";
import { registerNameUnderEthAddress } from "../../../store/app.reducer";

const mapStateToProps = state => ({
    registrationState: state.app.aoNameRegistrationState
});

const mapDispatchToProps = {
    registerNameUnderEthAddress
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
);
