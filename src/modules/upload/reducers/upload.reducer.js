// Constants
export const UPDATE_CURRENT_UPLOAD_STEP = 'UPDATE_CURRENT_UPLOAD_STEP'
export const UPDATE_UPLOAD_FORM_FIELD = 'UPDATE_UPLOAD_FORM_FIELD'
export const UPDATE_PRICING = 'UPDATE_PRICING'
export const RESET_UPLOAD_FORM = 'RESET_UPLOAD_FORM'

export const PRICING_DEFAULTS = [{
    stakeRatio: 1,
    profitPercentage: 10,
    headline: 'new content creators',
    label: 'great exposure',
}, {
    stakeRatio: 1.4,
    profitPercentage: 25,
    headline: 'established content creators',
    label: 'moderate pricing',
}, {
    stakeRatio: 2.2,
    profitPercentage: 60,
    headline: 'premium high demand content',
    label: 'premium pricing',
}]

// Actions
export const updateLastReachedStep = (step) => ({
    type: UPDATE_CURRENT_UPLOAD_STEP,
    payload: step
})
export const updateUploadFormField = (inputName, inputValue) => ({
    type: UPDATE_UPLOAD_FORM_FIELD,
    payload: {
        inputName,
        inputValue,
    }
})
export const resetUploadForm = () => {
    return (dispatch, getState) => {
        const state = getState()
        const video = state.upload.form.video
        if ( video ) {
            window.URL.revokeObjectURL(video.preview);
        }
        dispatch({
            type: RESET_UPLOAD_FORM,
        })
    }
}
// Only provide stake/profit if custom pricingOption = 0
export const updatePricingOption = (pricingOption, stake = undefined, profit = undefined) => {
    return (dispatch, getState) => {
        const state = getState()
        const file = state.upload.form.video
        const fileSizeInMb = ~~(file.size / 1000 / 1000)
        let payload = null
        if ( pricingOption > 0 ) {
            let pricingConstraints = PRICING_DEFAULTS[pricingOption - 1]
            payload = {
                pricingOption,
                stake: fileSizeInMb * pricingConstraints.stakeRatio,
                profit: pricingConstraints.profitPercentage
            }
        } else {            
            payload = {
                pricingOption,
                stake: stake ? Math.max(stake, fileSizeInMb) : state.upload.form.stake,
                profit: profit ? Math.min(Math.max(profit, 1), 99) : state.upload.form.profit,
            }
        }
        dispatch({
            type: UPDATE_PRICING,
            payload
        })
    }
}

// State
const initialState = {
    lastReachedUploadStep: 'start',
    form: {
        video: undefined,
        videoTeaser: undefined,
        featuredImage: undefined,
        title: undefined,
        description: undefined,
        pricingOption: 1,  // 0 = custom, 1-3 predefined inputs
        stake: undefined,
        profit: undefined,        
    },    
}
export type UploadReducerType = {
    lastReachedUploadStep: 'start' | 'pricing' | 'reload' | 'content',
}

// Reducer
export default function uploadReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_CURRENT_UPLOAD_STEP:
            return {
                ...state,
                lastReachedUploadStep: action.payload
            }
        case UPDATE_UPLOAD_FORM_FIELD:
            return {
                ...state,
                form: {
                    ...state.form,
                    [action.payload.inputName]: action.payload.inputValue
                }
            }
        case UPDATE_PRICING:
            return {
                ...state,
                form: {
                    ...state.form,
                    ...action.payload
                }
            }
        case RESET_UPLOAD_FORM:
            return {
                ...state,
                lastReachedUploadStep: 'start',
                form: {}
            }
        default:
            return state
    }
}
