// @flow
/**
 * BootLayout is rendered when:
 *   ao-core is not connected && ready
 * This is a chance to render what is happening in the background
 * and possibly notify user that we cannot connect to ao-core.
 */
import React from 'react';
import IpcLogs from '../../modules/electron/components/IpcLogs';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';


const BootLayout = ({networkError, states, isElectron}) => (
    <div className="BootLayout">
        <Typography variant="display1">{'AO'}</Typography>
        {isElectron ? (
            <IpcLogs />
        ) : null}
        <CircularProgress />
        <Snackbar
            open={!!networkError}
            message={<span>{'Unable to connect to ao-core, make sure it is running at:'}<br/>{window.AO_CORE_URL}</span>}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
        />

    </div>
)

const mapStateToProps = (state) => ({
    states: state.app.states,
    isElectron: state.electron.isElectron,
})

export default connect(mapStateToProps)(BootLayout)