import DevelopmentBar from '../components/DevelopmentBar'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"

// Redux
const mapStateToProps = (store) => {
    return {
        app: store.app,
        isElectron: store.electron.isElectron,
    }
}

// GraphQL
const graphqlQuery = gql(`
    query {
        version
    }
`)

export default compose(
    graphql(graphqlQuery),
    connect(mapStateToProps),
)(DevelopmentBar);