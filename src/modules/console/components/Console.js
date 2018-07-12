// @flow
import React, { PureComponent } from 'react';
import Typography from '@material-ui/core/Typography';

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
        const { logs } = this.props.data
        return (
            <div className="Console">
                <Typography variant="body1">
                    <ul style={{listStyle: 'none', padding: 0, margin: 0}}>{logs && logs.map((log, index) => (
                        <li key={index}>{log.message}</li>
                    ))}</ul>
                </Typography>
            </div>
        );
    }
}
