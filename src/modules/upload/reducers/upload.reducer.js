// Constants
export const UPDATE_CURRENT_UPLOAD_STEP = 'UPDATE_CURRENT_UPLOAD_STEP'
export const UPDATE_UPLOAD_FORM_FIELD = 'UPDATE_UPLOAD_FORM_FIELD'
export const UPDATE_PRICING = 'UPDATE_PRICING'
export const RESET_UPLOAD_FORM = 'RESET_UPLOAD_FORM'
export const STAKE_TRANSACTION_SUCCESS = 'STAKE_TRANSACTION_SUCCESS'
export const STAKE_TRANSACTION_ERROR = 'STAKE_TRANSACTION_ERROR'


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
        const { video, videoTeaser, featuredImage } = state.upload.form
        // Cleanup file resources
        if ( video ) {
            window.URL.revokeObjectURL(video.preview);
        }
        if ( videoTeaser ) {
            window.URL.revokeObjectURL(videoTeaser.preview);
        }
        if ( featuredImage ) {
            window.URL.revokeObjectURL(featuredImage.preview);
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
export const triggerStakeTransaction = () => {
    return (dispatch, getState) => {
        // reset the stake transaction state
        dispatch({type: STAKE_TRANSACTION_ERROR, payload: undefined})
        dispatch({type: STAKE_TRANSACTION_SUCCESS, payload: undefined})
        return new Promise((resolve, reject) => {        
            const state = getState()
            if ( state.electron.isElectron ) {
                window.chrome.ipcRenderer.send('open-metamask-popup')
            }
            const stakeParams = {
                stake: state.upload.form.stake,
                split: state.upload.form.profit,
            }
            const messageToSign = JSON.stringify(stakeParams)
            const hashedMessage = window.web3.sha3(messageToSign)
            window.web3.eth.sign(state.app.ethAddress, hashedMessage, function(error, result) {
                if ( error ) {
                    dispatch({
                        type: STAKE_TRANSACTION_ERROR,
                        payload: error
                    })
                    reject(error)
                } else {
                    dispatch({
                        type: STAKE_TRANSACTION_SUCCESS,
                        payload: result
                    })
                    resolve(result)
                }
            })
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
        title: '',
        description: '',
        pricingOption: 1,  // 0 = custom, 1-3 predefined inputs
        stake: undefined,
        profit: undefined,
    },
    stakeTransaction: {
        result: undefined,
        error: undefined,
    }
}
export type UploadReducerType = {
    lastReachedUploadStep: 'start' | 'pricing' | 'reload' | 'content' | 'submit',
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
                form: {
                    ...initialState.form
                }
            }
        case STAKE_TRANSACTION_SUCCESS:
            return {
                ...state,
                stakeTransaction: {
                    result: action.payload
                }
            }
        case STAKE_TRANSACTION_ERROR:
            return {
                ...state,
                stakeTransaction: {
                    error: action.payload
                }
            }
        default:
            return state
    }
}
