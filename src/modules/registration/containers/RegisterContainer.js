import Register from '../components/Register'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"
import { localNodeQuery } from '../../../AppContainer'
import withStateMutation from '../../../utils/withStateMutation'

// Redux
const mapStateToProps = (store) => {
    return {
        app: store.app,
        isElectron: store.electron.isElectron
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
                    ethAddress: props.app.ethAddress 
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