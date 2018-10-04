import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"

// GraphQL
const exportMutation = gql(`
    mutation exportMutation($inputs: ExportInputs) {
        export(inputs: $inputs)
    }
`)

export default graphql(exportMutation)