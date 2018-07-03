// Constants
export const SET_TEASER_LISTING_STATE = 'SET_TEASER_LISTING_STATE'
export const SET_VIDEO_PLAYBACK_STATE = 'SET_VIDEO_PLAYBACK_STATE'

// Actions
export const setTeaserListingState = ({isActive}) => ({
    type: SET_TEASER_LISTING_STATE,
    payload: { isActive }
})
export const setVideoPlaybackState = ({isActive}) => ({
    type: SET_VIDEO_PLAYBACK_STATE,
    payload: { isActive }
})

// State
const initialState = {
    teaserListingActive: false,
    videoPlaybackActive: false,
}

// Reducer
export default function videoReducer(state = initialState, action) {
    switch (action.type) {
        case SET_TEASER_LISTING_STATE:
            return {
                ...state,
                teaserListingActive: action.payload.isActive
            }
        case SET_VIDEO_PLAYBACK_STATE:
            return {
                ...state,
                videoPlaybackActive: action.payload.isActive
            }
        default:
            return state
    }
}
