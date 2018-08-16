import BigNumber from "bignumber.js";

// Constants
export const UPDATE_ICO_STATE = 'UPDATE_ICO_STATE'

// Actions
export const updateIcoState = () => {
    return (dispatch, getState) => {
        const state = getState()
        const { contracts } = state
        contracts.aoToken.icoEnded(function(err, ended) {
            if ( ended ) {
                dispatch({
                    type: UPDATE_ICO_STATE, 
                    payload: {
                        icoEnded: true
                    }
                })
            }
        })
        contracts.aoToken.icoTotalSupply(function(err, supply) {
            if ( supply ) {
                dispatch({
                    type: UPDATE_ICO_STATE, 
                    payload: {
                        icoTotalSupply: new BigNumber(supply)
                    }
                })
            }
        })
        contracts.aoToken.MAX_ICO_SUPPLY(function(err, supply) {
            if ( supply ) {
                dispatch({
                    type: UPDATE_ICO_STATE,
                    payload: {
                        icoMaxSupply: new BigNumber(supply)
                    }
                })
            }
        })
        
    }
}


// State
const initialState = {
    icoEnded: false,
    icoTotalSupply: new BigNumber(0),
    icoMaxSupply: new BigNumber(0),
}

// Reducer
export default function icoReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_ICO_STATE:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}
