// Constants
export const SET_TEASER_LISTING_STATE = 'SET_TEASER_LISTING_STATE'

// Actions
export const setTeaserListingState = ({isActive}) => ({
    type: SET_TEASER_LISTING_STATE,
    payload: { isActive }
})

// State
const initialState = {
    teaserListingActive: false,
}

// Reducer
export default function videoReducer(state = initialState, action) {
    switch (action.type) {
        case SET_TEASER_LISTING_STATE:
            return {
                ...state,
                teaserListingActive: action.payload.isActive
            }
        default:
            return state
    }
}
