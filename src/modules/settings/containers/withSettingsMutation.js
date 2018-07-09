import { graphql, compose } from 'react-apollo'
import withStateMutation from '../../../utils/withStateMutation'
import { updateSettingsMutation, settingsQuery } from '../graphql/settings'
import { SettingsType } from '../graphql/settings';

export type SettingsMutationProps = {
    data: {
        loading: boolean,
        error?: string,
        settings?: SettingsType
    },
    updateSettings: Function,
    updateSettingsLoading: boolean,
    updateSettingsError?: Error,
};

export default compose(
    graphql(settingsQuery),
    graphql(updateSettingsMutation, {
        name: 'updateSettings',
        options: (props) => ({
            refetchQueries: [
                {
                    query: settingsQuery
                }
            ]
        })
    }),
    withStateMutation({name: 'updateSettings'})
);