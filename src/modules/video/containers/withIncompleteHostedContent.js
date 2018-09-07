/**
 * withIncompleteHostedContent
 * 
 * Slightly verbose name, but essentially this is a list of content
 * that the users has begun pulling into their node (purchasing) but
 * has not finished the process (re-hosting)
 */
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from "graphql-tag"
import VideoContentFragment from '../../../graphql/fragments/VideoContentFragment'


// Redux
const mapDispatchToProps = {
    
}

const mapStateToProps = (store) => {
    return {
        
    }
}

// GraphQL
const incompleteHostedContentQuery = gql(`
    query {
        node {
            id,
            hostedContent(incomplete: true) {
                ...VideoContentFragment
            }
        }
    }
    ${VideoContentFragment}
`)

export default compose(    
    connect(mapStateToProps, mapDispatchToProps),
    graphql(incompleteHostedContentQuery, {
        name: 'incompleteHostedContentQuery',
    }),
);