import Settings from '../components/Settings'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"

// Redux
const mapStateToProps = (store) => {
    return {
        
    }
}

// GraphQL
const settingsQuery = gql(`
    query {
        state, version
    }
`)

export default compose(    
    connect(mapStateToProps),
    graphql(settingsQuery, {
        name: 'settings'
    }),
)(Settings);