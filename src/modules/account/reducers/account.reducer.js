// Constants
export const ACCOUNT_VIDEO_LISTING_FILTER = 'ACCOUNT_VIDEO_LISTING_FILTER'
export const ACCOUNT_VIDEO_LISTING_ORDERING = 'ACCOUNT_VIDEO_LISTING_ORDERING'

// Actions
export const setAccountVideoListingFilter = (filter) => ({
    type: ACCOUNT_VIDEO_LISTING_FILTER,
    payload: filter
})
export const setAccountVideoListingOrdering = (ordering) => ({
    type: ACCOUNT_VIDEO_LISTING_ORDERING,
    payload: ordering
})

// State
const initialState = {
    videoListingFilter: 'uploaded',  // uploaded || downloaded
    videoListingOrdering: 'recent',  // recent || earned || staked
}

// Reducer
export default function accountReducer(state = initialState, action) {
    switch (action.type) {
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
        default:
            return state
    }
}
