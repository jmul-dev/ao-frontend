import BigNumber from "bignumber.js";
import { waitForTransactionReceipt } from '../../../contracts/contracts.reducer'


// Constants
export const SET_TEASER_LISTING_STATE = 'SET_TEASER_LISTING_STATE'
export const SET_ACTIVE_VIDEO = 'SET_ACTIVE_VIDEO'
export const BUY_CONTENT_TRANSACTION = Object.freeze({
    SUBMITTED: 'BUY_CONTENT_TRANSACTION.SUBMITTED',
    RESULT: 'BUY_CONTENT_TRANSACTION.RESULT',
    ERROR: 'BUY_CONTENT_TRANSACTION.ERROR',
    RESET: 'BUY_CONTENT_TRANSACTION.RESET',
})

// Actions
export const setTeaserListingState = ({isActive}) => ({
    type: SET_TEASER_LISTING_STATE,
    payload: { isActive }
})

export const setActiveVideo = (video) => ({
    type: SET_ACTIVE_VIDEO,
    payload: { video }
})

/**
 * Lifecycle:
 *  - trigger metamask transaction
 *  - transactionHash is available (if submitted via metamask) -> SUBMITTED
 *  - listen for transaction to be rejected -> ERROR
 *  - listen for transaction BuyContent event -> RESULT
 */
export const buyContent = (contentHostId, { onTransactionSubmitted, onTransactionFailed, onPurchaseReceipt }) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const state = getState()
            const { contracts, app } = state
            const dispatchError = (error) => {
                onTransactionFailed(error)
                // TODO: notification error dispatch 
                dispatch({
                    type: BUY_CONTENT_TRANSACTION.ERROR,
                    payload: {
                        contentHostId,
                        error,
                    }
                })                
            }
            // 1. Get latest price
            dispatch( getContentPrice(contentHostId) ).then(contentPrice => {
                // 2. buyContent
                contracts.aoContent.buyContent(contentHostId, contentPrice.toNumber(), 0, "ao", { from: app.ethAddress }, (error, transactionHash) => {
                    if ( error ) {
                        console.error(`buyContent error: ${error.message}`)                        
                        dispatchError(error)
                        return;
                    }
                    // 3a. Transaction submitted succesfully (has not been confirmed)
                    onTransactionSubmitted(transactionHash)                    
                    dispatch({
                        type: BUY_CONTENT_TRANSACTION.SUBMITTED,
                        payload: {
                            contentHostId,
                            transactionHash
                        }
                    })
                    // 3b. Listen for tx completion and Purchase receipt
                    let eventListener = contracts.aoContent.BuyContent({buyer: app.ethAddress}, function(error, result) {
                        if ( result && result.transactionHash === transactionHash ) {
                            eventListener.stopWatching()
                            // 4. We have purchase result
                            onPurchaseReceipt(result.args.purchaseId)
                            dispatch({
                                type: BUY_CONTENT_TRANSACTION.RESULT,
                                payload: {
                                    contentHostId,
                                    result: result.args.purchaseId,
                                }
                            })
                        }
                    })
                    waitForTransactionReceipt(transactionHash).catch(error => {
                        eventListener.stopWatching()                        
                        dispatchError(new Error(`Transaction failed`))
                    })
                })
            }).catch(dispatchError)
        })
    }
}
export const getContentPrice = (contentHostId) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const state = getState()
            const { contracts } = state
            contracts.aoContent.contentHostPrice(contentHostId, (error, contentPrice) => {
                if ( error ) {
                    console.error(`Error fetching content price: ${error.message}`)
                    reject(error)
                    return;
                }
                resolve(new BigNumber(contentPrice))
            })
        })
    }
}


// State
const initialState = {
    teaserListingActive: false,
    activeVideo: undefined,
    buyContentTransactions: {
        // contentHostId => { tx, error, result }
    }
}

// Reducer
export default function videoReducer(state = initialState, action) {
    switch (action.type) {
        case SET_TEASER_LISTING_STATE:
            return {
                ...state,
                teaserListingActive: action.payload.isActive
            }
        case SET_ACTIVE_VIDEO:
            return {
                ...state,
                activeVideo: action.payload.video,
            }
        case BUY_CONTENT_TRANSACTION.SUBMITTED:
            return {
                ...state,
                buyContentTransactions: {
                    ...state.buyContentTransactions,
                    [action.payload.contentHostId]: {
                        transactionHash: action.payload.transactionHash
                    }
                }
            }
        case BUY_CONTENT_TRANSACTION.ERROR: {
            const existingTransactionState = state.buyContentTransactions[action.payload.contentHostId] || {}
            return {
                ...state,
                buyContentTransactions: {
                    ...state.buyContentTransactions,
                    [action.payload.contentHostId]: {
                        ...existingTransactionState,
                        error: action.payload.error
                    }
                }
            }
        }
        case BUY_CONTENT_TRANSACTION.RESULT: {
            const existingTransactionState = state.buyContentTransactions[action.payload.contentHostId] || {}
            return {
                ...state,
                buyContentTransactions: {
                    ...state.buyContentTransactions,
                    [action.payload.contentHostId]: {
                        ...existingTransactionState,
                        result: action.payload.result
                    }
                }
            }
        }
        default:
            return state
    }
}
