/**
 * Provides 2 Components:
 * 1. Copy/Icons/Loading state for the action
 * 2. The actual actions
 */
import React, { Component, Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { CircularProgress } from '@material-ui/core';
import AlertIcon from '@material-ui/icons/ErrorOutline';
import PlayIcon from '@material-ui/icons/PlayArrow';
import { withApollo, compose } from 'react-apollo';
import { connect } from 'react-redux';
import gql from "graphql-tag";


export const statesPendingUserAction = [
    'DOWNLOADED',
    'DECRYPTION_KEY_RECEIVED',
    'VERIFIED',
    'ENCRYPTED',
    'DISCOVERABLE',
    'DISCOVERED',
]

export const ContentPurchaseState = ({content}) => {
    let isLoadingState = false
    let Icon = null
    let copy = null
    switch (content.state) {
        case 'DOWNLOADING':
            isLoadingState = true;
            copy = 'Downloading...';
            break;
        case 'DOWNLOADED':
            // Content is download, indicate need to purchase
            copy = 'Pay for video';
            Icon = AlertIcon;
            break;
        case 'PURCHASING':
            isLoadingState = true;
            copy = 'Paying...';
            break;
        case 'PURCHASED':  
            // Content is purchased, waiting for decryption key
            isLoadingState = true;
            copy = 'Waiting for decryption key...';
            break;
        case 'DECRYPTION_KEY_RECEIVED':
            copy = 'Decrypt video';
            Icon = AlertIcon;
            break;
        case 'DECRYPTED':
            // Content is purchased, waiting for decryption key
            isLoadingState = true;
            copy = 'Waiting for decryption key...';
            break;
        case 'VERIFIED':
            // Content verified, automatically proceeds to encrypting
            isLoadingState = true;
            copy = 'Video verified';
            break;
        case 'VERIFICATION_FAILED':
            copy = 'Video failed verification';
            Icon = AlertIcon;
            break;
        case 'ENCRYPTING':
            isLoadingState = true;
            copy = 'Encrypting video...';
            break;
        case 'ENCRYPTED':
            // Video is encrypted, indicate need to becomeHost/stake
            copy = 'Submit verification and become host';
            Icon = AlertIcon;
            break;
        case 'STAKING':
            isLoadingState = true;
            copy = 'Submitting verification...';
            break;
        case 'STAKED':
            isLoadingState = true;
            copy = 'Making discoverable...';
            break;
        case 'DISCOVERABLE':
        case 'DISCOVERED':
            copy = 'Watch now';
            Icon = PlayIcon;
            break;
        default:
            break;
    }
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            {isLoadingState ? (
                <CircularProgress size={20} style={{marginRight: 8}} />
            ) : null}
            {Icon ? (
                <Icon style={{marginRight: 4}} />
            ) : null}
            {copy}
        </div>        
    )
}

// Redux actions
const mapDispatchToProps = {
    
}
// Redux state
const mapStateToProps = (store) => {
    return {
        
    }
}

const withContentPurchaseActions = compose(
    withApollo,
    connect(mapStateToProps, mapDispatchToProps)
)

/**
 * ContentPurchaseAction:
 * 
 * The god class of this frontend app.
 * 
 * @param {content} Object AO Content
 * @param {client} ApolloClient
 * @param {children} Function Accepting parameters {action}
 */
class ContentPurchaseActionComponent extends Component {
    constructor() {
        super()
        this.state = {
            loading: false
        }
    }
    render() {
        const { content, client, children } = this.props
        const { loading } = this.state
        let action = null
        let graphqlQuery = null
        let reduxAction = null
        switch (content.state) {
            case 'DISCOVERED':
                // The first action, download content (bring in to core)
                action = () => {
                    this.setState({loading: true})
                    client.query({
                        query: gql(`
                            query {
                                state,
                                node {
                                    id, ethAddress
                                }
                            }
                        `)
                    }).then(({data}) => {
                        this.setState({loading: false})
                        console.log(data)
                    })
                }
                break;
            case 'DOWNLOADING':
                // No action to take
                break;
            case 'DOWNLOADED':
                // Content is download, purchase action now available

                break;
            case 'PURCHASING':
                break;
            case 'PURCHASED':  
                // Content is purchased, waiting for decryption key
                break;
            case 'DECRYPTION_KEY_RECEIVED':
                break;
            case 'DECRYPTED':
                // Content is purchased, waiting for decryption key
                break;
            case 'VERIFIED':
                // Content verified, automatically proceeds to encrypting
                break;
            case 'VERIFICATION_FAILED':
                break;
            case 'ENCRYPTING':
                break;
            case 'ENCRYPTED':
                // Video is encrypted, indicate need to becomeHost/stake
                break;
            case 'STAKING':
                break;
            case 'STAKED':
                break;
            case 'DISCOVERABLE':
                break;        
            default:
                break;
        }
        action = () => {
            this.setState({loading: true})
            setTimeout(() => {
                client.query({
                    query: gql(`
                        query {
                            state,
                            node {
                                id, ethAddress
                            }
                        }
                    `)
                }).then(({data}) => {
                    this.setState({loading: false})
                    console.log(data)
                })
            }, 1000)
        }
        return children({action, loading})
    }
}

export const ContentPurchaseAction = withContentPurchaseActions(ContentPurchaseActionComponent)

// export const ContentPurchaseAction = withContentPurchaseActions(({content, client, children, ...props}) => {
//     let action = null
//     let graphqlQuery = null
//     let reduxAction = null
//     let loading = false
//     switch (content.state) {
//         case 'DISCOVERED':
//             // The first action, download content (bring in to core)
//             action = () => {
//                 loading = true
//                 client.query({
//                     query: gql(`
//                         query {
//                             state,
//                             node {
//                                 id, ethAddress
//                             }
//                         }
//                     `)
//                 }).then(({data}) => {
//                     loading = false
//                     console.log(data)
//                 })
//             }
//             break;
//         case 'DOWNLOADING':
//             // No action to take
//             break;
//         case 'DOWNLOADED':
//             // Content is download, purchase action now available

//             break;
//         case 'PURCHASING':
//             break;
//         case 'PURCHASED':  
//             // Content is purchased, waiting for decryption key
//             break;
//         case 'DECRYPTION_KEY_RECEIVED':
//             break;
//         case 'DECRYPTED':
//             // Content is purchased, waiting for decryption key
//             break;
//         case 'VERIFIED':
//             // Content verified, automatically proceeds to encrypting
//             break;
//         case 'VERIFICATION_FAILED':
//             break;
//         case 'ENCRYPTING':
//             break;
//         case 'ENCRYPTED':
//             // Video is encrypted, indicate need to becomeHost/stake
//             break;
//         case 'STAKING':
//             break;
//         case 'STAKED':
//             break;
//         case 'DISCOVERABLE':
//             break;        
//         default:
//             break;
//     }
//     action = () => {
//         loading = true
//         client.query({
//             query: gql(`
//                 query {
//                     state,
//                     node {
//                         id, ethAddress
//                     }
//                 }
//             `)
//         }).then(({data}) => {
//             loading = false
//             console.log(data)
//         })
//     }
//     return children({action, loading})
// })