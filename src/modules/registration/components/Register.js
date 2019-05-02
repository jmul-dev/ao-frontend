import { PureComponent } from "react";
import PropTypes from "prop-types";

export default class Register extends PureComponent {
    static propTypes = {
        register: PropTypes.func.isRequired,
        registerLoading: PropTypes.bool,
        registerError: PropTypes.any,
        registerResult: PropTypes.object,
        ethAddress: PropTypes.string,
        aoNameId: PropTypes.string,
        coreConnected: PropTypes.bool
    };
    componentDidMount() {
        if (this.props.ethAddress) this._register();
    }
    componentWillReceiveProps(nextProps) {
        if (
            nextProps.ethAddress &&
            this.props.ethAddress !== nextProps.ethAddress
        ) {
            this._register();
        }
        if (nextProps.ethAddress) {
            if (!this.props.coreConnected && nextProps.coreConnected) {
                this._register();
            }
        }
        if (
            this.props.ethAddress === nextProps.ethAddress &&
            this.props.aoNameId !== nextProps.aoNameId
        ) {
            // Same ethAddress, but the user registered a name in contracts, update registration with core
            this._register();
        }
    }
    _register() {
        this.props.register();
    }
    render() {
        return null;
    }
}
