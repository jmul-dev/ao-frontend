// @flow
import React, { Component } from 'react';
import '../styles/account.css';

type Props = {
    account: {
        loading: boolean,
        error?: string,
    }
};

export default class Account extends Component<Props> {
    props: Props;
    render() {
        const { loading, error, state } = this.props.account
        return (
            <div className="Account">
                <h2>Account</h2>
                {loading ? 'loading' : ''}
            </div>
        );
    }
}
