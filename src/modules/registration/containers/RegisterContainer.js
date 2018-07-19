import Register from '../components/Register'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"
import { localNodeQuery } from '../../../AppContainer'
import withStateMutation from '../../../utils/withStateMutation'

// Redux
const mapStateToProps = (store) => {
    return {
        ethAddress: store.app.ethAddress,
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
                    ethAddress: props.ethAddress 
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