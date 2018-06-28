// @flow
import React from 'react'
import MaxStorageInput from './components/MaxStorageInput'
import NetworkBandwidthInput from './components/NetworkBandwidthInput';
import MaxPeerConnectionsInput from './components/MaxPeerConnectionsInput';

type Props = {
    inputName: 'maxDiskSpace' | 
               'maxBandwidthUp' | 
               'maxBandwidthDown' |
               'maxPeerConnections'
}

export default ({inputName} = Props) => {
    switch (inputName) {
        case 'maxDiskSpace':
            return <MaxStorageInput />
        case 'maxBandwidthUp':
        case 'maxBandwidthDown':
            return <NetworkBandwidthInput inputName={inputName} />
        case 'maxPeerConnections':
            return <MaxPeerConnectionsInput />
        default:
            console.warn('Unknown or un-implemented inputName provided to settings input component', inputName)
            return null;
    }
}