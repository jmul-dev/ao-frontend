import { connect } from "react-redux";
import { submitEthereumRpcValue } from "../reducers/electron.reducer";

const mapDispatchToProps = {
    submitEthereumRpcValue
};

const mapStateToProps = state => ({
    ethRpcPrompt: state.electron.ethRpcPrompt
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
);
