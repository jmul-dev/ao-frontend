import StorageInputs from '../components/StorageInputs'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"
import withStateMutation from '../../../utils/withStateMutation'
import { updateSettingsMutation, settingsQuery } from '../graphql/settings'


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
)(StorageInputs);