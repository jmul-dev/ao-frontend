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
import NotificationSnackbar from '../../modules/notifications/components/NotificationSnackbar'
import Lottie from 'react-lottie';
import * as loadingAnimation from './loadingAnimation.json'


const BootLayout = ({networkError, states, isElectron}) => (
    <div className="BootLayout">
        <div className="loading-container" style={{padding: 16}}>
            <Typography variant="body1" style={{color: '#03B742'}}>{'starting up...'}</Typography>
            <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000000', zIndex: -1}}>
                <Lottie
                    style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}
                    height={1000}
                    width={1000}
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: loadingAnimation,
                        rendererSettings: {
                            preserveAspectRatio: 'xMidYMid slice'
                        }
                    }}
                />
            </div>
        </div>        
        {isElectron ? (
            <IpcLogs />
        ) : null}
        <NotificationSnackbar
            open={!!networkError}
            variant="warning"
            message={`Unable to connect to ao-core, make sure it is running at: ${window.AO_CORE_URL}`}
        />

    </div>
)

const mapStateToProps = (state) => ({
    states: state.app.states,
    isElectron: state.electron.isElectron,
})

export default connect(mapStateToProps)(BootLayout)