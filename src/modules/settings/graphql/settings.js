import gql from "graphql-tag";
import PropTypes from "prop-types";

export const SettingsPropTypes = {
    maxDiskSpace: PropTypes.number,
    maxBandwidthUp: PropTypes.number,
    maxBandwidthDown: PropTypes.number,
    maxPeerConnections: PropTypes.number,
    runInBackground: PropTypes.bool,
    runOnStartup: PropTypes.bool,
    checkForUpdates: PropTypes.bool
};

export const SettingsFieldsFragment = `
    fragment SettingsFieldsFragment on Settings {
        maxDiskSpace,
        maxBandwidthUp,
        maxBandwidthDown,
        maxPeerConnections,
        runInBackground,
        runOnStartup,
        checkForUpdates,
        ethNetworkRpc
    }
`;

export const settingsQuery = gql(`
    query {
        settings {
            ...SettingsFieldsFragment
        }
    }
    ${SettingsFieldsFragment}
`);

export const updateSettingsMutation = gql(`
    mutation updateSettings($inputs: SettingsInputs) {
        updateSettings(inputs: $inputs) {
            ...SettingsFieldsFragment
        }
    }
    ${SettingsFieldsFragment}
`);
