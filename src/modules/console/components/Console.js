// @flow
import React, { PureComponent } from 'react';

type Props = {
    data: {
        loading: boolean,
        error?: string,
        logs?: Array<{
            createdAt: string,
            message: string
        }>
    }
};

export default class Console extends PureComponent<Props> {
    props: Props;
    render() {
        const { loading, error, logs } = this.props.data
        return (
            <div>
                <h2>Console</h2>
                <div>{`Loading...`}</div>
                <ul>{logs && logs.map((log, index) => (
                    <li key={index}>{log.message}</li>
                ))}</ul>
            </div>
        );
    }
}
