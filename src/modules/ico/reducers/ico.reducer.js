import BigNumber from "bignumber.js";
import { CONTRACTS_INITIALIZED } from "../../../contracts/contracts.reducer";

// Constants
export const UPDATE_PRIMORDIAL_STATE = 'UPDATE_PRIMORDIAL_STATE'

// Actions
export const updateIcoState = () => {
    return (dispatch, getState) => {
        const state = getState()
        const { contracts, app } = state
        if ( !app.states[CONTRACTS_INITIALIZED] ) {
            console.warn('Calling contract methods before contracts initialized')
            return;
        }
        contracts.aoToken.networkExchangeEnded(function(err, ended) {
            if ( ended ) {
                dispatch({
                    type: UPDATE_PRIMORDIAL_STATE, 
                    payload: {
                        primordialSaleEnded: true
                    }
                })
            }
        })
        contracts.aoToken.primordialTotalSupply(function(err, supply) {
            if ( supply ) {
                dispatch({
                    type: UPDATE_PRIMORDIAL_STATE, 
                    payload: {
                        primordialTotalSupply: new BigNumber(supply)
                    }
                })
            }
        })
        contracts.aoToken.MAX_Primordial_SUPPLY(function(err, supply) {
            if ( supply ) {
                dispatch({
                    type: UPDATE_PRIMORDIAL_STATE,
                    payload: {
                        primordialMaxSupply: new BigNumber(supply)
                    }
                })
            }
        })
        contracts.aoToken.primordialBuyPrice(function(err, buyPrice) {
            if ( buyPrice ) {
                dispatch({
                    type: UPDATE_PRIMORDIAL_STATE,
                    payload: {
                        primordialBuyPrice: new BigNumber(buyPrice)
                    }
                })
            }
        })
    }
}


// State
const initialState = {
    primordialSaleActive: false,
    primordialSaleEnded: false,
    primordialTotalSupply: new BigNumber(0),
    primordialMaxSupply: new BigNumber(0),
    primordialBuyPrice: new BigNumber(0),
}

// Reducer
export default function icoReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_PRIMORDIAL_STATE:
            let updatedState = {
                ...state,
                ...action.payload
            }
            if ( updatedState.primordialBuyPrice.gt(0) && !updatedState.primordialSaleEnded ) {
                updatedState.primordialSaleActive = true
            } else {
                updatedState.primordialSaleActive = false
            }
            return updatedState
        default:
            return state
    }
}
