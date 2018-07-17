// @flow
import React from 'react';
import IpcLogs from '../../modules/electron/components/IpcLogs';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';


const BootLayout = ({networkError, states, isElectron}) => (
    <div className="BootLayout">
        <Typography>{JSON.stringify(states)}</Typography>
        {isElectron ? (
            <IpcLogs />
        ) : null}
        {networkError ? (
            <Typography>{'network error, check core started'}</Typography>
        ) : null}
    </div>
)

const mapStateToProps = (state) => ({
    states: state.app.states,
    isElectron: state.electron.isElectron,
})

export default connect(mapStateToProps)(BootLayout)