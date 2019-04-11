import { graphql, compose } from "react-apollo";
import withStateMutation from "../../../utils/withStateMutation";
import { updateSettingsMutation, settingsQuery } from "../graphql/settings";
import { SettingsPropTypes } from "../graphql/settings";
import PropTypes from "prop-types";

export const WithSettingsMutationPropTypes = {
    // settingsQuery
    data: PropTypes.shape({
        loading: PropTypes.bool,
        error: PropTypes.any,
        settings: PropTypes.shape(SettingsPropTypes)
    }).isRequired,
    // updateSettingsMutation
    updateSettings: PropTypes.func.isRequired,
    updateSettingsLoading: PropTypes.bool.isRequired,
    updateSettingsError: PropTypes.any
};

export default compose(
    graphql(settingsQuery),
    graphql(updateSettingsMutation, {
        name: "updateSettings",
        options: props => ({
            refetchQueries: [
                {
                    query: settingsQuery
                }
            ]
        })
    }),
    withStateMutation({ name: "updateSettings" })
);
