import App from './App'
import { graphql } from 'react-apollo'
import gql from "graphql-tag"

const graphqlQuery = gql(`
    query {
        isRegistered
    }
`)

export default graphql(graphqlQuery)(App);