// @flow
import React, { PureComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import autoscroll from 'autoscroll-react';


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

class Console extends PureComponent<Props> {
    props: Props;
    render() {
        const { data, style, ...props } = this.props
        const { logs } = this.props.data
        return (
            <div className="Console">
                <Typography variant="body1" component="div">
                    <ul {...props} style={{listStyle: 'none', padding: 0, margin: 0, ...style}}>{logs && logs.map((log, index) => (
                        <li key={index} style={{display: 'flex', marginBottom: 12}}>
                            <time style={{width: 60, flexShrink: 0, color: '#777777'}}>{moment(log.createdAt).format('H:mm')}</time>
                            <div>{log.message}</div>                            
                        </li>
                    ))}</ul>
                </Typography>
            </div>
        );
    }
}

export default autoscroll(Console)