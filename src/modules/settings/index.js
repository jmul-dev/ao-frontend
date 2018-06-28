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

export default ({inputName, inputLabel} = Props) => {
    switch (inputName) {
        case 'maxDiskSpace':
            return <MaxStorageInput />
        case 'maxBandwidthUp':
        case 'maxBandwidthDown':
            return <NetworkBandwidthInput inputName={inputName} inputLabel={inputLabel} />
        case 'maxPeerConnections':
            return <MaxPeerConnectionsInput />
        case 'runOnStartup':
        case 'runInBackground':
        case 'checkForUpdates':
            return <SwitchInput inputName={inputName} inputLabel={inputLabel} />
        default:
            console.warn('Unknown or un-implemented inputName provided to settings input component', inputName)
            return null;
    }
}