// @flow
import React, { Component } from 'react';
import withElectronEventLogs from '../containers/withElectronEventLogs';


type Props = {
    eventLogs: Array<object>;
}

class IpcLogs extends Component<Props> {
    props: Props;
    render() {
        const { eventLogs } = this.props
        return (
            <div className="IpcLogs">
               {eventLogs.map((eventLog, index) => (
                   <div key={index}>{eventLog.message}</div>
               ))}
            </div>
        );
    }
}
export default withElectronEventLogs(IpcLogs)