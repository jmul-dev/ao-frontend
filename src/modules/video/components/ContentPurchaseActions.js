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
import contentRetryHostDiscoveryMutation from '../../../graphql/mutations/contentRetryHostDiscovery';
import { becomeHost, buyContent, setVideoPlayback } from '../reducers/video.reducer';
import { addNotification } from '../../notifications/reducers/notifications.reducer';
import { localNodeQuery } from '../../../AppContainer';
import { videoQuery } from '../containers/withVideo';
import { stakeContent } from '../../upload/reducers/upload.reducer';
import { contentUploadStakeTransaction } from '../../upload/containers/withUploadFormMutation';

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

/**
 * 
 * @returns { isLoadingState, stateCopy, stateIcon, actionCopy, actionRequired, }
 */
export const getContentState = (content) => {
    const isUploadedContent = content.nodeId && content.nodeId === content.creatorId  // NOTE: ideally we would compare app.ethAddress to content.creatorId
    let returnData = {
        isLoadingState: false,
        stateCopy: null,
        StateIcon: null,
        actionRequired: statesPendingUserAction.indexOf(content.state) > -1,
        actionCopy: null,        
    }
    switch (content.state) {
        case 'HOST_DISCOVERY':
            returnData.isLoadingState = true;
            returnData.stateCopy = 'Finding host...';
            break;
        case 'HOST_DISCOVERY_FAILED':
            returnData.isLoadingState = false;
            returnData.stateCopy = 'Host not found, retry?';
            returnData.StateIcon = ReplayIcon;
            break;
        case 'DOWNLOADING':
            returnData.isLoadingState = true;
            returnData.stateCopy = 'Downloading...';
            break;
        case 'DOWNLOADED':
            // Content is download, indicate need to purchase
            returnData.stateCopy = 'Pay for video';
            returnData.StateIcon = AlertIcon;
            break;
        case 'PURCHASING':
            returnData.isLoadingState = true;
            returnData.stateCopy = 'Paying...';
            break;
        case 'PURCHASED':
            // Content is purchased, waiting for decryption key
            returnData.isLoadingState = true;
            returnData.stateCopy = 'Waiting for decryption key...';
            break;
        case 'DECRYPTION_KEY_RECEIVED':
            returnData.stateCopy = 'Verifying content...';
            returnData.StateIcon = AlertIcon;
            break;
        case 'VERIFIED':
            // Content verified, automatically proceeds to encrypting
            returnData.isLoadingState = true;
            returnData.stateCopy = 'Video verified';
            break;
        case 'VERIFICATION_FAILED':
            returnData.stateCopy = 'Video failed verification';
            returnData.StateIcon = AlertIcon;
            break;
        case 'ENCRYPTED':
            // Video is encrypted, indicate need to becomeHost/stake
            returnData.isLoadingState = true;
            returnData.stateCopy = 'Initializing content...';
            break;
        case 'DAT_INITIALIZED':
            returnData.stateCopy = isUploadedContent ? 'Stake content' : 'Submit verification and become host';
            returnData.StateIcon = AlertIcon;
            break;
        case 'STAKING':
            returnData.isLoadingState = true;
            returnData.stateCopy = isUploadedContent ? 'Staking content...' : 'Submitting verification...';
            break;
        case 'STAKED':
            returnData.isLoadingState = true;
            returnData.stateCopy = 'Making discoverable...';
            break;
        case 'DISCOVERABLE':
        case 'DISCOVERED':
            returnData.stateCopy = 'Watch now';
            returnData.StateIcon = PlayIcon;
            break;
        default:
            break;
    }
    if ( returnData.isLoadingState ) {
        returnData.StateIcon = CircularProgress //<CircularProgress size={20} style={{ marginRight: 8 }} />
    }
    return returnData
}

export const ContentPurchaseState = ({ content, iconOnly = false }) => {
    const isUploadedContent = content.nodeId && content.nodeId === content.creatorId  // NOTE: ideally we would compare app.ethAddress to content.creatorId
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
            copy = isUploadedContent ? 'Stake content' : 'Submit verification and become host';
            Icon = AlertIcon;
            break;
        case 'STAKING':
            isLoadingState = true;
            copy = isUploadedContent ? 'Staking content...' : 'Submitting verification...';
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {isLoadingState ? (
                <CircularProgress size={20} style={{ marginRight: 8 }} />
            ) : null}
            {Icon ? (
                <Icon style={{ marginRight: 4 }} />
            ) : null}
            {iconOnly ? null : copy}
        </div>
    )
}

// Redux actions
const mapDispatchToProps = {
    buyContent,
    becomeHost,
    setVideoPlayback,
    addNotification,
    stakeContent,
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
        this.setState({ loading: false, error: errorMessage })
        this.props.addNotification({
            message: `${errorMessage}: ${error.message}`,
            variant: 'error'
        })
    }
    _downloadContentAction = () => {
        const { client, content } = this.props
        this.setState({ loading: true, error: null })
        client.mutate({
            mutation: contentRequestMutation,
            variables: {
                metadataDatKey: content.id
            },
            refetchQueries: [{
                query: videoQuery,
                variables: { id: content.id }
            }],
        }).then(({ data, ...props }) => {
            console.log(data, props);
            this.setState({ loading: false })
        }).catch(error => {
            this._dispatchErrorNotificationAndStopLoading(error, 'Failed to request content', 'Error during contentRequestMutation')
        })
    }
    _buyContentAction = () => {
        const { buyContent, content, client } = this.props
        this.setState({ loading: true, error: null })
        try {
            // 1. Get user's public key (required for buyContent contract call)
            const { node } = client.readQuery({
                query: localNodeQuery
            })
            const { publicAddress, publicKey } = node
            // 2. Trigger the buyContent transaction via metamask
            buyContent(content.contentHostId, publicKey, publicAddress).then(transactionHash => {
                // 3. Notify core that the user is purchasing content
                client.mutate({
                    mutation: contentPurchaseTransactionMutation,
                    variables: {
                        inputs: {
                            transactionHash,
                            contentId: content.id,
                            contentHostId: content.contentHostId,
                        }
                    }
                }).then(({ data, ...props }) => {
                    console.log(data, props)
                    this.setState({ loading: false })
                    // 3. Not sure we need to do anything here, state will be updated via polling on content.state
                }).catch(error => {
                    this._dispatchErrorNotificationAndStopLoading(error, 'Failed to move content to purchasing state', 'Error during contentPurchaseTransactionMutation')
                })
            }).catch(error => {
                this._dispatchErrorNotificationAndStopLoading(error, 'Buy content transaction failed', 'Error during buyContent action')
            })
        } catch (error) {
            this._dispatchErrorNotificationAndStopLoading(error, 'Unable to get user publicAddress from cache', 'Error during buyContent action')
        }
    }
    _becomeHostAction = () => {
        const { becomeHost, content, client } = this.props
        this.setState({ loading: true, error: null })
        // 1. Metamask transaction
        becomeHost({
            contentId: content.id,
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
            }).then(({ data, ...props }) => {
                this.setState({ loading: false })
                // 3. Not sure we need to do anything here, state will be updated via pulling on content.state
            }).catch(error => {
                this._dispatchErrorNotificationAndStopLoading(error, 'Failed to move content to hosting state', 'Error during contentBecomeHostTransaction mutation')
            })
        }).catch(error => {
            this._dispatchErrorNotificationAndStopLoading(error, 'Host content transaction failed', 'Error during becomeHost action')
        })
    }
    _stakeContentAction = () => {
        const { stakeContent, content, client } = this.props
        this.setState({ loading: true, error: null })
        stakeContent({
            networkTokenAmount: content.stake * (1 - (content.stakePrimordialPercentage / 100.0)),
            primordialTokenAmount: content.stake * (content.stakePrimordialPercentage / 100.0),
            fileDatKey: content.fileDatKey,
            metadataDatKey: content.metadataDatKey,
            fileSizeInBytes: content.fileSize,
            profitPercentage: content.profitSplitPercentage,
            baseChallenge: content.baseChallenge,
            encChallenge: content.encChallenge,
        }).then(transactionHash => {
            // 2. Submit the tx to core
            client.mutate({
                mutation: contentUploadStakeTransaction,
                variables: {
                    inputs: {
                        contentId: content.id,
                        transactionHash,
                    }
                }
            }).then(() => {
                this.setState({ loading: false })
            }).catch(error => {
                this._dispatchErrorNotificationAndStopLoading(error, 'Failed to update content\'s stake transaction', '_stakeContentAction')
            })
        }).catch(error => {
            this._dispatchErrorNotificationAndStopLoading(error, 'Error during stake process', '_stakeContentAction')
        })
    }
    _watchContent = () => {
        const { setVideoPlayback, content, contentRef } = this.props
        let initialPosition = {}
        if (contentRef) {
            let clientRect = contentRef.getBoundingClientRect()
            const propertySelection = (({ top, right, bottom, left, width, height }) => ({ top, right, bottom, left, width, height }))
            initialPosition = propertySelection(clientRect)
        }
        setVideoPlayback({ contentId: content.id, initialPosition })
    }
    _retryHostDiscovery = () => {
        const { content, client } = this.props
        this.setState({ loading: true, error: null })
        client.mutate({
            mutation: contentRetryHostDiscoveryMutation,
            variables: {
                id: content.id
            }
        }).then(({ data, ...props }) => {
            this.setState({ loading: false })
        }).catch(error => {
            this._dispatchErrorNotificationAndStopLoading(error, 'Failed to retry host discovery', 'Error during contentRetryHostDiscoveryMutation')
        })
    }
    render() {
        const { content, children } = this.props
        const { loading, error } = this.state
        const isUploadedContent = content.nodeId === content.creatorId  // NOTE: ideally we would compare app.ethAddress to content.creatorId
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
                action = isUploadedContent ? this._stakeContentAction : this._becomeHostAction
                actionCopy = isUploadedContent ? 'Stake content' : 'Become host'
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
        return children({ action, actionCopy, loading, error })
    }
}

export const ContentPurchaseAction = withContentPurchaseActions(ContentPurchaseActionComponent)
