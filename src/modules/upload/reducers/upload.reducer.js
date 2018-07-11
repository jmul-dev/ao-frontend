// Constants
export const UPDATE_CURRENT_UPLOAD_STEP = 'UPDATE_CURRENT_UPLOAD_STEP'
export const UPDATE_UPLOAD_FORM_FIELD = 'UPDATE_UPLOAD_FORM_FIELD'

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
        default:
            return state
    }
}
