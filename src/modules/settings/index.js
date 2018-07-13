// @flow
import React from 'react'
import MaxStorageInput from './components/MaxStorageInput'
import NetworkBandwidthInput from './components/NetworkBandwidthInput';
import MaxPeerConnectionsInput from './components/MaxPeerConnectionsInput';
import SwitchInput from './components/SwitchInput';

type Props = {
    inputName: 'maxDiskSpace' | 
               'maxBandwidthUp' | 
               'maxBandwidthDown' |
               'maxPeerConnections'
               ,
    inputLabel: string,
}

export default ({inputName, inputLabel, ...props} = Props) => {
    switch (inputName) {
        case 'maxDiskSpace':
            return <MaxStorageInput {...props} />
        case 'maxBandwidthUp':
        case 'maxBandwidthDown':
            return <NetworkBandwidthInput inputName={inputName} inputLabel={inputLabel} {...props} />
        case 'maxPeerConnections':
            return <MaxPeerConnectionsInput {...props} />
        case 'runOnStartup':
        case 'runInBackground':
        case 'checkForUpdates':
            return <SwitchInput inputName={inputName} inputLabel={inputLabel} {...props} />
        default:
            console.warn('Unknown or un-implemented inputName provided to settings input component', inputName)
            return null;
    }
}