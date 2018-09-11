// @flow
/**
 * BootLayout is rendered when:
 *   ao-core is not connected && ready
 * This is a chance to render what is happening in the background
 * and possibly notify user that we cannot connect to ao-core.
 */
import React, { Component } from 'react';
import IpcLogs from '../../modules/electron/components/IpcLogs';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Lottie from 'react-lottie';
import * as loadingAnimation from './loadingAnimation.json';
import { addNotification, dismissNotification } from '../../modules/notifications/reducers/notifications.reducer'


class BootLayout extends Component {
    constructor() {
        super()
        this.state = {
            animationStarted: false
        }
    }
    componentDidMount() {
        this._animationTimeout = setTimeout(() => {
            this.setState({
                animationStarted: true
            })
        }, 500)  // slight delay to avoid flashing of animation (see App.js setTimeout)
        this._connectionTimeout = setTimeout(() => {
            this._networkErrorNotId = this.props.addNotification({
                message: `Unable to connect to ao-core, make sure it is running at: ${window.AO_CORE_URL}`,
                variant: 'warning',
            })
        }, 3000)
    }
    componentWillUnmount() {
        clearTimeout(this._connectionTimeout)
        clearTimeout(this._animationTimeout)
        if ( this._networkErrorNotId ) {
            this.props.dismissNotification(this._networkErrorNotId)
        }
    }
    render() {
        const { isElectron } = this.props
        return (
            <div className="BootLayout">
                <div className="loading-container" style={{padding: 16}}>
                    <Typography variant="body1" style={{color: '#03B742', position: 'relative', zIndex: 1}}>{'starting up...'}</Typography>
                    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000000', zIndex: 0}}>
                        <Lottie
                            style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}
                            height={1000}
                            width={1000}
                            isStopped={!this.state.animationStarted}
                            options={{
                                loop: true,
                                autoplay: false,
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
            </div>
        )
    }
}

const mapDispatchToProps = {
    addNotification,
    dismissNotification,
}

const mapStateToProps = (state) => ({
    states: state.app.states,
    isElectron: state.electron.isElectron,
})

export default connect(mapStateToProps, mapDispatchToProps)(BootLayout)