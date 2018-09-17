import BigNumber from "bignumber.js";

// Constants
export const SET_TEASER_LISTING_STATE = 'SET_TEASER_LISTING_STATE'
export const SET_ACTIVE_VIDEO = 'SET_ACTIVE_VIDEO'
export const SET_VIDEO_PLAYBACK = 'SET_VIDEO_PLAYBACK'
export const SET_SEARCH_VALUE = 'SET_SEARCH_VALUE'
export const SET_SEARCH_BAR_ACTIVE = 'SET_SEARCH_BAR_ACTIVE'


// Actions
export const setTeaserListingState = ({isActive}) => ({
    type: SET_TEASER_LISTING_STATE,
    payload: { isActive }
})

export const setActiveVideo = (video) => ({
    type: SET_ACTIVE_VIDEO,
    payload: { video }
})

export const setVideoPlayback = ({contentId, initialPosition}) => ({
    type: SET_VIDEO_PLAYBACK,
    payload: {
        contentId,
        initialPosition,
    }
})

export const updateSearchValue = (value) => ({
    type: SET_SEARCH_VALUE,
    payload: value
})

export const setSearchBarActive = (state) => ({
    type: SET_SEARCH_BAR_ACTIVE,
    payload: state
})

/**
 * NOTE: this method resolves once we have a transactionHash (not the actual purchase receipt)
 */
export const buyContent = (contentHostId, publicKey) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            if ( !contentHostId ) {
                // TODO: dispatch error notification
                console.warn(`buyContent called without contentHostId`)
            } else {
                const state = getState()
                const { contracts, app } = state
                // 1. Get latest price
                dispatch( getContentPrice(contentHostId) ).then(contentPrice => {
                    // 2. buyContent
                    contracts.aoContent.buyContent(
                        contentHostId, 
                        contentPrice.toNumber(), // networkIntegerAmount
                        0, // networkFractionAmount
                        "ao",
                        publicKey,  // publicKey of requesting node
                        { from: app.ethAddress }, (error, transactionHash) => {
                        if ( error ) {
                            console.error(`buyContent error: ${error.message}`)                        
                            reject(error)
                            return;
                        }
                        // 3a. Transaction submitted succesfully (has not been confirmed)
                        resolve(transactionHash)
                    })
                }).catch(reject)
            }
        })
    }
}
export const becomeHost = ({purchaseId, signature, encChallenge, contentDatKey, metadataDatKey}) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const state = getState()
            const { contracts, app } = state
            // 1. becomeHost
            contracts.aoContent.becomeHost(purchaseId, signature.v, signature.r, signature.s, encChallenge, contentDatKey, metadataDatKey, { from: app.ethAddress }, (error, transactionHash) => {
                if ( error ) {
                    console.error(`becomeHost error: ${error.message}`)                        
                    reject(error)
                    return;
                }
                // 3a. Transaction submitted succesfully (has not been confirmed)
                resolve(transactionHash)
            })
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
    videoPlayback: {
        contentId: undefined,
        initialPosition: undefined,
    },
    searchString: undefined,
    searchBarActive: false,
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
        case SET_VIDEO_PLAYBACK:
            return {
                ...state,
                videoPlayback: {
                    ...action.payload
                }
            }
        case SET_SEARCH_VALUE:
            return {
                ...state,
                searchString: action.payload
            }
        case SET_SEARCH_BAR_ACTIVE:
            return {
                ...state,
                searchBarActive: action.payload
            }
        default:
            return state
    }
}
