import React from 'react'
import MaxStorageInput from './components/MaxStorageInput'
import NetworkBandwidthInput from './components/NetworkBandwidthInput';

export default ({inputName}) => {
    switch (inputName) {
        case 'maxDiskSpace':
            return <MaxStorageInput />
        case 'maxBandwidthUp':
        case 'maxBandwidthDown':
            return <NetworkBandwidthInput inputName={inputName} />
        default:
            console.warn('Unknown or un-implemented inputName provided to settings input component', inputName)
            return null;
    }
}