import BigNumber from "bignumber.js";

// Constants
export const ACCOUNT_VIDEO_LISTING_FILTER = 'ACCOUNT_VIDEO_LISTING_FILTER'
export const ACCOUNT_VIDEO_LISTING_ORDERING = 'ACCOUNT_VIDEO_LISTING_ORDERING'
export const UPDATE_CONTENT_METRICS_BY_STAKE_ID = 'UPDATE_CONTENT_METRICS_BY_STAKE_ID'
export const ACCOUNT_CONTENT_TYPE_FILTER = 'ACCOUNT_CONTENT_TYPE_FILTER'
export const MEDIA_TYPES = ['all', 'video', 'image', 'music', 'document', 'digital_asset', 'application']

// Actions
export const setAccountContentTypeFilter = (filter) => ({
    type: ACCOUNT_CONTENT_TYPE_FILTER,
    payload: filter
})
export const setAccountVideoListingFilter = (filter) => ({
    type: ACCOUNT_VIDEO_LISTING_FILTER,
    payload: filter
})
export const setAccountVideoListingOrdering = (ordering) => ({
    type: ACCOUNT_VIDEO_LISTING_ORDERING,
    payload: ordering
})
export const getContentMetrics = (stakeId) => {
    return (dispatch, getState) => {
        const { contracts } = getState()
        contracts.aoLibrary.getContentMetrics(contracts.aoContent.address, contracts.aoEarning.address, stakeId, function(err, result) {
            if ( !err ) {
                dispatch({
                    type: UPDATE_CONTENT_METRICS_BY_STAKE_ID,
                    payload: {
                        stakeId,
                        networkTokenStaked: new BigNumber(result[0]),
                        primordialTokenStaked: new BigNumber(result[1]),
                        primordialTokenStakedWeight: new BigNumber(result[2]),
                        totalStakeEarning: new BigNumber(result[3]),
                        totalHostEarning: new BigNumber(result[4]),
                        totalFoundationEarning: new BigNumber(result[5]),
                    }
                })
            }
        })
    }
}
export const getPurchaseReceipt = (purchaseId) => {
    return (dispatch, getState) => {    
        return new Promise((resolve, reject) => {    
            const { contracts } = getState()
            if ( !purchaseId )
                return reject(new Error(`getPurchaseReceipt called with no purchaseId`))
            contracts.aoContent.purchaseReceiptById(purchaseId, function(err, result) {
                if ( !err ) {
                    resolve({
                        contentHostId: result[0],
                        buyer: result[1],
                        networkAmount: result[2],
                        publicAddress: result[3],
                        timestamp: result[4]
                    })
                } else {
                    reject(err)
                }
            })
        })
    }
}

// State
const initialState = {
    videoListingFilter: 'downloaded',  // uploaded || downloaded
    videoListingOrdering: 'recent',  // recent || earned || staked
    contentTypeFilter: MEDIA_TYPES[0],  // MEDIA_TYPES
    contentMetrics: {},  // stakeId => { metrics }
}

// Reducer
export default function accountReducer(state = initialState, action) {
    switch (action.type) {
        case ACCOUNT_CONTENT_TYPE_FILTER:
            return {
                ...state,
                contentTypeFilter: action.payload,
            }
        case ACCOUNT_VIDEO_LISTING_FILTER:
            return {
                ...state,
                videoListingFilter: action.payload,
            }
        case ACCOUNT_VIDEO_LISTING_ORDERING:
            return {
                ...state,
                videoListingOrdering: action.payload,
            }
        case UPDATE_CONTENT_METRICS_BY_STAKE_ID:
            return {
                ...state,
                contentMetrics: {
                    ...state.contentMetrics,
                    [action.payload.stakeId]: action.payload
                }
            }
        default:
            return state
    }
}
