import BigNumber from "bignumber.js";

// Constants
export const SET_TEASER_LISTING_STATE = 'SET_TEASER_LISTING_STATE'
export const SET_ACTIVE_VIDEO = 'SET_ACTIVE_VIDEO'
export const SET_VIDEO_PLAYBACK = 'SET_VIDEO_PLAYBACK'
export const SET_SEARCH_VALUE = 'SET_SEARCH_VALUE'
export const SET_SEARCH_BAR_ACTIVE = 'SET_SEARCH_BAR_ACTIVE'
export const PUSH_TO_RECENTLY_HOSTED_CONTENT = 'PUSH_TO_RECENTLY_HOSTED_CONTENT'
export const REMOVE_RECENTLY_HOSTED_CONTENT = 'REMOVE_RECENTLY_HOSTED_CONTENT'


// Actions
export const setTeaserListingState = ({isActive}) => ({
    type: SET_TEASER_LISTING_STATE,
    payload: { isActive }
})
// active video: TeaserCard -> Playback
export const setActiveVideo = (video) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_ACTIVE_VIDEO,
            payload: { video }
        })
        const { recentlyHostedContentIds } = getState().video
        if ( recentlyHostedContentIds.indexOf(video.id) > -1 ) {
            dispatch({
                type: REMOVE_RECENTLY_HOSTED_CONTENT,
                payload: {
                    contentId: video.id
                }
            })
        }
    }
}
// video playback: My videos -> Playback
export const setVideoPlayback = ({contentId, initialPosition}) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_VIDEO_PLAYBACK,
            payload: {
                contentId,
                initialPosition,
            }
        })
        const { recentlyHostedContentIds } = getState().video
        if ( recentlyHostedContentIds.indexOf(contentId) > -1 ) {
            dispatch({
                type: REMOVE_RECENTLY_HOSTED_CONTENT,
                payload: {
                    contentId
                }
            })
        }
    }
}

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
export const buyContent = (contentHostId, publicKey, publicAddress) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            if ( !contentHostId ) {
                console.warn(`buyContent called without contentHostId`)
                reject()
            } else {
                const state = getState()
                const { contracts, app } = state
                // 0. Let's make sure this is a valid content host before purchasing!
                dispatch( checkContentHostIsStaked(contentHostId) ).then(() => {
                    // 1. Get latest price
                    dispatch( getContentPrice(contentHostId) ).then(contentPrice => {
                        // 2. buyContent
                        contracts.aoContent.buyContent(
                            contentHostId,
                            contentPrice.toNumber(), // networkIntegerAmount
                            0, // networkFractionAmount
                            "ao",
                            publicKey, // publicKey of requesting node
                            publicAddress, // publicAddress of requesting node
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
                }).catch(reject)
            }
        })
    }
}
export const becomeHost = ({contentId, purchaseId, signature, encChallenge, contentDatKey, metadataDatKey}) => {
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
                dispatch({
                    type: PUSH_TO_RECENTLY_HOSTED_CONTENT,
                    payload: contentId
                })
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
                } else if ( !contentPrice ) {
                    console.error(`Content price not found for contentHostId: ${contentHostId}`)
                    reject(error)
                    return;
                }
                resolve(new BigNumber(contentPrice))
            })
        })
    }
}
export const checkContentHostIsStaked = (contentHostId) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const state = getState()
            const { contracts } = state
            contracts.aoContent.contentHostById(contentHostId, function(err, result) {
                if (err) {
                    console.error(err)
                    return reject(new Error(`Content host not found`))
                }
                const stakeId = result[0]
                contracts.aoContent.stakedContentById(stakeId, function(err, result) {
                    if (err) {
                        console.error(err)
                        return reject(new Error(`Stake not found for content host`))
                    }
                    if ( result[6] ) {
                        return resolve()
                    } else {
                        return reject(new Error(`Content host is no longer staking`))
                    }
                })
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
    recentlyHostedContentIds: [],
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
        case PUSH_TO_RECENTLY_HOSTED_CONTENT:
            return {
                ...state,
                recentlyHostedContentIds: state.recentlyHostedContentIds.concat([action.payload])
            }
        case REMOVE_RECENTLY_HOSTED_CONTENT:            
            return {
                ...state,
                recentlyHostedContentIds: state.recentlyHostedContentIds.filter(id => id !== action.payload.contentId)
            }
        default:
            return state
    }
}
