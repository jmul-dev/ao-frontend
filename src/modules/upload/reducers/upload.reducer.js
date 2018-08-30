import { waitForTransactionReceipt } from '../../../contracts/contracts.reducer'

// Constants
export const UPDATE_CURRENT_UPLOAD_STEP = 'UPDATE_CURRENT_UPLOAD_STEP'
export const UPDATE_UPLOAD_FORM_FIELD = 'UPDATE_UPLOAD_FORM_FIELD'
export const UPDATE_PRICING = 'UPDATE_PRICING'
export const RESET_UPLOAD_FORM = 'RESET_UPLOAD_FORM'
export const CONTENT_SUBMITTION_RESULT = 'CONTENT_SUBMITTION_RESULT'

export const STAKE_TRANSACTION = Object.freeze({
    INITIALIZED: 'STAKE_TRANSACTION.INITIALIZED',
    SUBMITTED: 'STAKE_TRANSACTION.SUBMITTED',
    RESULT: 'STAKE_TRANSACTION.RESULT',
    ERROR: 'STAKE_TRANSACTION.ERROR',
    RESET: 'STAKE_TRANSACTION.RESET',
})


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
// stakeTokenType: 'primordial' | 'network' | 'both'
// stakeTokenSplit: 'primordial' / 'network'
//      1 = 100% primordial, 
//      0 = 0% primordial, 100% network
//      0.5 = 50/50 split
export const updatePricingOption = (pricingOption, stake = undefined, profit = undefined, stakeTokenType = undefined, stakeTokenSplit = undefined) => {
    return (dispatch, getState) => {
        const state = getState()
        const file = state.upload.form.video
        const fileSize = file.size
        let payload = null
        if ( pricingOption > 0 ) {
            let pricingConstraints = PRICING_DEFAULTS[pricingOption - 1]
            payload = {
                pricingOption,
                stake: fileSize * pricingConstraints.stakeRatio,
                profit: pricingConstraints.profitPercentage,
                stakeTokenType: 'primordial',
                stakeTokenSplit: 100,
            }
        } else {            
            payload = {
                pricingOption,
                stake: stake ? Math.max(stake, fileSize) : state.upload.form.stake,
                profit: profit ? Math.min(Math.max(profit, 1), 99) : state.upload.form.profit,
                stakeTokenType: stakeTokenType ? stakeTokenType : state.upload.form.stakeTokenType,
                stakeTokenSplit: stakeTokenSplit !== undefined ? stakeTokenSplit : state.upload.form.stakeTokenSplit,
            }
        }
        dispatch({
            type: UPDATE_PRICING,
            payload
        })
    }
}
export const stakeContent = ({networkTokenAmount, primordialTokenAmount, fileDatKey, metadataDatKey, fileSizeInBytes, profitPercentage, baseChallenge, encChallenge}) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {  
            const rejectAndDispatchError = (err) => {
                dispatch({
                    type: STAKE_TRANSACTION.ERROR,
                    payload: err
                })
                reject(err)
            }
            const state = getState()
            if ( state.electron.isElectron ) {
                window.chrome.ipcRenderer.send('open-metamask-popup')
            }
            const { contracts, app } = state
            // 1. Contract method
            // NOTE: for now token & primordial token amounts are in base denomination
            const profitPercentageWithDivisor = parseInt(profitPercentage, 10) * 10000;  // 10^4
            contracts.aoContent.stakeContent(
                parseInt(networkTokenAmount, 10),  // networkTokenIntegerAmount
                0,  // networkTokenFractionalAmount
                'ao',  // denomination                
                parseInt(primordialTokenAmount, 10),  // primordialTokenAmount
                baseChallenge,  // baseChallenge public key
                encChallenge,  // encryted baseChallenge unique to host
                fileDatKey,
                metadataDatKey,
                fileSizeInBytes,
                profitPercentageWithDivisor,
                { from: app.ethAddress },
                function(err, transactionHash) {
                    if ( err ) {
                        rejectAndDispatchError(err)
                    } else {
                        resolve(transactionHash)
                        /**
                         * NOTE: we are actually listening for the tx success on the backend (core)
                         * as well. This is really only helpful for error messages.
                         */
                        // 2. 
                        let eventListener = contracts.aoContent.StakeContent({stakeOwner: app.ethAddress}, function(error, result) {
                            if ( result && result.transactionHash === transactionHash ) {
                                dispatch({
                                    type: STAKE_TRANSACTION.RESULT,
                                    payload: result.args
                                })
                                // TODO: update all balances (eth, token, primordial, and staked)
                                // dispatch(getEthBalanceForAccount(app.ethAddress))
                                // dispatch(getTokenBalanceForAccount(app.ethAddress))
                                eventListener.stopWatching()
                            }
                        })
                        dispatch({
                            type: STAKE_TRANSACTION.SUBMITTED,
                            payload: transactionHash
                        })
                        waitForTransactionReceipt(transactionHash).then(() => {
                            eventListener.stopWatching()
                        }).catch(err => {
                            eventListener.stopWatching()
                            rejectAndDispatchError(err)
                        })                        
                    }
                }
            )
        })        
    }
}
export const setContentSubmittionResult = (result) => ({
    type: CONTENT_SUBMITTION_RESULT,
    payload: result
})

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
        stakeTokenType: 'primordial',
        stakeTokenSplit: 100,
    },
    contentSubmittionResult: undefined,
    stakeTransaction: {
        initialized: undefined,
        transactionHash: undefined,
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
        case STAKE_TRANSACTION.INITIALIZED:
            return {
                ...state,
                stakeTransaction: {
                    initialized: true,                    
                }
            }
        case STAKE_TRANSACTION.SUBMITTED:
            return {
                ...state,
                stakeTransaction: {
                    ...state.stakeTransaction,
                    transactionHash: action.payload,
                }
            }
        case STAKE_TRANSACTION.RESULT:
            return {
                ...state,
                stakeTransaction: {
                    ...state.stakeTransaction,
                    result: action.payload,
                }
            }
        case STAKE_TRANSACTION.ERROR:
            return {
                ...state,
                stakeTransaction: {
                    ...state.stakeTransaction,
                    error: action.payload
                }
            }
        case CONTENT_SUBMITTION_RESULT:
            return {
                ...state,
                contentSubmittionResult: action.payload
            }
        default:
            return state
    }
}
