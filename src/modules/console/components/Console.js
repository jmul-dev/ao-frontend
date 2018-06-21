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
        const { loading, logs } = this.props.data
        if ( loading )
            return 'Loading...'
        return (
            <div>
                <h2>Console</h2>                
                <ul>{logs.map((log, index) => (
                    <li key={index}>{log.message}</li>
                ))}</ul>
            </div>
        );
    }
}
