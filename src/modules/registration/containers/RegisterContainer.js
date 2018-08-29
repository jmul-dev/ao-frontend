import Register from '../components/Register'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"
import { localNodeQuery } from '../../../AppContainer'
import withStateMutation from '../../../utils/withStateMutation'
import { APP_STATES } from '../../../store/app.reducer'

// Redux
const mapStateToProps = (store) => {
    return {
        ethNetworkId: store.app.ethNetworkId,
        ethAddress: store.app.ethAddress,
        coreConnected: store.app.states[APP_STATES.CORE_CONNECTED],
    }
}

// GraphQL
const registerMutation = gql(`
    mutation registerMutation($inputs: RegisterInputs) {
        register(inputs: $inputs) {
            id, ethAddress
        }
    }
`)

export default compose(    
    connect(mapStateToProps),
    graphql(registerMutation, {
        name: 'register',
        // Pull ethAddress input from redux props
        options: (props) => ({
            variables: {
                inputs: {
                    ethAddress: props.ethAddress,
                    networkId: props.ethNetworkId,
                }
            },
            refetchQueries: [
                {
                    query: localNodeQuery
                }
            ]
        })
    }),
    withStateMutation({name: 'register'}),
)(Register);