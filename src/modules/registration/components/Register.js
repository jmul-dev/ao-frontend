// @flow
import { PureComponent } from 'react';

type Props = {
    register: Function,
    registerLoading: boolean,
    registerError?: Error,
    registerResult: any,
    ethAddress?: string,
    coreConnected: boolean,
};

export default class Register extends PureComponent<Props> {
    props: Props;
    componentDidMount() {
        if ( this.props.ethAddress )
            this._register()
    }
    componentWillReceiveProps(nextProps) {
        if ( nextProps.ethAddress && this.props.ethAddress !== nextProps.ethAddress ) {
            this._register()
        }
        if ( nextProps.ethAddress ) {
            if ( !this.props.coreConnected && nextProps.coreConnected ) {
                this._register()
            }
        }
    }
    _register() {
        this.props.register()
    }
    render() {
        return null
    }
}
