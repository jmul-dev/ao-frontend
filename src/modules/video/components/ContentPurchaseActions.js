/**
 * Provides 2 Components:
 * 1. Copy/Icons/Loading state for the action
 * 2. The actual actions
 */
import { CircularProgress } from '@material-ui/core';
import AlertIcon from '@material-ui/icons/ErrorOutline';
import PlayIcon from '@material-ui/icons/PlayArrow';
import ReplayIcon from '@material-ui/icons/Replay';
import React, { Component } from 'react';
import { compose, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import contentPurchaseTransactionMutation from '../../../graphql/mutations/contentPurchaseTransaction';
import contentBecomeHostTransactionMutation from '../../../graphql/mutations/contentBecomeHostTransaction';
import contentRequestMutation from '../../../graphql/mutations/contentRequest';
import { becomeHost, buyContent, setVideoPlayback } from '../reducers/video.reducer';

/*
DISCOVERED
HOST_DISCOVERY
HOST_DISCOVERY_FAILED
DOWNLOADING
DOWNLOADED
PURCHASING
PURCHASED
DECRYPTION_KEY_RECEIVED
VERIFIED
VERIFICATION_FAILED
ENCRYPTED
DAT_INITIALIZED
STAKING
STAKED
DISCOVERABLE
*/

export const statesPendingUserAction = [
    'HOST_DISCOVERY_FAILED',
    'DOWNLOADED',
    'DAT_INITIALIZED',
    'DISCOVERABLE',
    'DISCOVERED',
]

export const ContentPurchaseState = ({content}) => {
    let isLoadingState = false
    let Icon = null
    let copy = null
    switch (content.state) {
        case 'HOST_DISCOVERY':
            isLoadingState = true;
            copy = 'Finding host...';
            break;
        case 'HOST_DISCOVERY_FAILED':
            isLoadingState = false;
            copy = 'Host not found, retry?';
            Icon = ReplayIcon;
            break;
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
            copy = 'Verifying content...';
            Icon = AlertIcon;
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
        case 'ENCRYPTED':
            // Video is encrypted, indicate need to becomeHost/stake
            isLoadingState = true;
            copy = 'Initializing content...';
            break;
        case 'DAT_INITIALIZED':
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
    buyContent,
    becomeHost,
    setVideoPlayback,
}
// Redux state
const mapStateToProps = (store, props) => {
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
 * @param {contentRef} Object A reference to the content being displayed (for animation purposes, 
 *                            we get the bounding box of this ref and animate to fullscreen video)
 * @param {client} ApolloClient
 * @param {children} Function Accepting parameters {action}
 */
class ContentPurchaseActionComponent extends Component {
    constructor() {
        super()
        this.state = {
            loading: false,
            error: null,
        }
    }
    _dispatchErrorNotificationAndStopLoading = (error, errorMessage, errorContext) => {
        console.error(errorContext, error)
        // TODO: error notification
        this.setState({loading: false})
    }
    _downloadContentAction = () => {
        const { client, content } = this.props
        this.setState({loading: true})
        client.mutate({
            mutation: contentRequestMutation,
            variables: {
                metadataDatKey: content.id
            }
        }).then(({data, ...props}) => {
            console.log(data, props);
            this.setState({loading: false})
        }).catch(error => {
            this._dispatchErrorNotificationAndStopLoading(error, 'Failed to request content', 'Error during contentRequestMutation')
        })
    }
    _buyContentAction = () => {
        const { buyContent, content, client } = this.props
        this.setState({loading: true})
        // 1. Trigger the buyContent transaction via metamask
        buyContent(content.contentHostId).then(transactionHash => {
            // 2. Notify core that the user is purchasing content
            client.mutate({
                mutation: contentPurchaseTransactionMutation,
                variables: {
                    inputs: {
                        transactionHash,
                        contentId: content.id,
                        contentHostId: content.contentHostId,
                    }
                }
            }).then(({data, ...props}) => {
                console.log(data, props)
                this.setState({loading: false})
                // 3. Not sure we need to do anything here, state will be updated via pulling on content.state
            }).catch(error => {
                this._dispatchErrorNotificationAndStopLoading(error, 'Failed to move content to purchasing state', 'Error during contentPurchaseTransactionMutation')
            })
        }).catch(error => {
            this._dispatchErrorNotificationAndStopLoading(error, 'Buy content transaction failed', 'Error during buyContent action')
        })
    }
    _becomeHostAction = () => {
        const { becomeHost, content, client } = this.props
        this.setState({loading: true})
        // 1. Metamask transaction
        becomeHost({
            purchaseId: content.purchaseId,
            signature: content.baseChallengeSignature,
            encChallenge: content.encChallenge,
            contentDatKey: content.fileDatKey,
            metadataDatKey: content.metadataDatKey,
        }).then(transactionHash => {
            // 2. Notify core that the user is attempting to host content
            client.mutate({
                mutation: contentBecomeHostTransactionMutation,
                variables: {
                    inputs: {
                        transactionHash,
                        contentId: content.id,
                    }
                }
            }).then(({data, ...props}) => {
                console.log(data, props)
                this.setState({loading: false})
                // 3. Not sure we need to do anything here, state will be updated via pulling on content.state
            }).catch(error => {
                this._dispatchErrorNotificationAndStopLoading(error, 'Failed to move content to hosting state', 'Error during contentBecomeHostTransaction mutation')
            })
        }).catch(error => {
            this._dispatchErrorNotificationAndStopLoading(error, 'Host content transaction failed', 'Error during becomeHost action')
        })
    }
    _watchContent = () => {
        const { setVideoPlayback, content, contentRef } = this.props
        let initialPosition = {}
        if ( contentRef ) {
            let clientRect = contentRef.getBoundingClientRect()
            const propertySelection = (({ top, right, bottom, left, width, height }) => ({ top, right, bottom, left, width, height }))
            initialPosition = propertySelection(clientRect)
        }
        setVideoPlayback({contentId: content.id, initialPosition})
    }
    _retryHostDiscovery = () => {
        console.warn(`TODO: _retryHostDiscovery not implemented`)
    }
    render() {
        const { content, children } = this.props
        const { loading } = this.state
        let error = this.state.error
        let action = null
        let actionCopy = ''
        switch (content.state) {
            case 'HOST_DISCOVERY':
                break;
            case 'HOST_DISCOVERY_FAILED':
                // TODO: retry host discovery?
                action = this._retryHostDiscovery
                actionCopy = 'Find host'
                break;
            case 'DISCOVERED':
                // The first action, download content (bring in to core)
                action = this._downloadContentAction
                actionCopy = 'Download content'
                break;
            case 'DOWNLOADING':
                // No action to take
                break;
            case 'DOWNLOADED':
                // Content is download, purchase action now available
                action = this._buyContentAction
                actionCopy = 'Purchase content'
                break;
            case 'PURCHASING':
                break;
            case 'PURCHASED':  
                // Content is purchased, waiting for decryption key
                break;
            case 'DECRYPTION_KEY_RECEIVED':
                // Verifying content
                break;
            case 'VERIFIED':
                // Content verified, automatically proceeds to encrypting
                break;
            case 'VERIFICATION_FAILED':
                // TODO: action = ? remove content from node?
                break;            
            case 'ENCRYPTED':
                // Video is encrypted, waiting for dat initialization
                break;
            case 'DAT_INITIALIZED':
                action = this._becomeHostAction
                actionCopy = 'Become host'
                break;
            case 'STAKING':
                break;
            case 'STAKED':
                break;
            case 'DISCOVERABLE':
                action = this._watchContent
                actionCopy = 'Watch now'
                break;
            default:
                break;
        }
        return children({action, actionCopy, loading, error})
    }
}

export const ContentPurchaseAction = withContentPurchaseActions(ContentPurchaseActionComponent)
