// Constants


// Actions


// State
const initialState = {
    currentStepIndex: 0,
}
export type UploadReducerType = {
    currentStepIndex: number,
}

// Reducer
export default function uploadReducer(state = initialState, action) {
    switch (action.type) {
        default:
            return state
    }
}
