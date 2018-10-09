import gql from 'graphql-tag';

export type SettingsType = {
    maxDiskSpace: number,
    maxBandwidthUp: number,
    maxBandwidthDown: number,
    maxPeerConnections: number,
    runInBackground: boolean,
    runOnStartup: boolean,
    checkForUpdates: boolean,
}

export const SettingsFieldsFragment = `
    fragment SettingsFieldsFragment on Settings {
        maxDiskSpace,
        maxBandwidthUp,
        maxBandwidthDown,
        maxPeerConnections,
        runInBackground,
        runOnStartup,
        checkForUpdates,
    }
`

export const settingsQuery = gql(`
    query {
        settings {
            ...SettingsFieldsFragment
        }
    }
    ${SettingsFieldsFragment}
`)

export const updateSettingsMutation = gql(`
    mutation updateSettings($inputs: SettingsInputs) {
        updateSettings(inputs: $inputs) {
            ...SettingsFieldsFragment
        }
    }
    ${SettingsFieldsFragment}
`)