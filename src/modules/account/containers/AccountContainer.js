import Account from '../components/Account'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"

// Redux
const mapStateToProps = (store) => {
    return {
        
    }
}

// GraphQL
const accountQuery = gql(`
    query {
        state
    }
`)

export default compose(    
    connect(mapStateToProps),
    graphql(accountQuery, {
        name: 'account'
    }),
)(Account);