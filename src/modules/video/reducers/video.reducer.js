// Constants
export const SET_TEASER_LISTING_STATE = 'SET_TEASER_LISTING_STATE'
export const SET_ACTIVE_VIDEO = 'SET_ACTIVE_VIDEO'

// Actions
export const setTeaserListingState = ({isActive}) => ({
    type: SET_TEASER_LISTING_STATE,
    payload: { isActive }
})
export const setActiveVideo = (video) => ({
    type: SET_ACTIVE_VIDEO,
    payload: { video }
})

// State
const initialState = {
    teaserListingActive: false,
    activeVideo: undefined,
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
        default:
            return state
    }
}
