// @flow
import React, { PureComponent } from 'react';
import { AppReducerType, APP_STATES } from '../../../store/app.reducer';

type Props = {
    register: Function,
    registerLoading: boolean,
    registerError?: Error,
    registerResult: any,
    ethAddress?: string,
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
    }
    _register() {
        this.props.register()
    }
    render() {
        return null
    }
}
