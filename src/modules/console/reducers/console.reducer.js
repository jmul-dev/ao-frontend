import { EVENT_LOG } from 'ao-core/dist/constants';
// Constants

// Actions
// export const checkIfAdvertisingIsPaused = () => {
//     return (dispatch, getState) => {
//         const currentState = getState()
//         const advertisingContract = currentState.contracts.advertisingContract
//         advertisingContract.paused.call((error, result) => {
//             if ( error ) {
//                 dispatch({
//                     type: SET_ADVERTISING_PAUSED,
//                     payload: true
//                 })
//                 return console.error(error)
//             }
//             dispatch({
//                 type: SET_ADVERTISING_PAUSED,
//                 payload: result
//             })
// 		})
//     }
// }

// State
const initialState = {
    eventLog: []
}

// Reducer
export default function consoleReducer(state = initialState, action) {
    switch (action.type) {
        case EVENT_LOG:
            return {
                ...state,
                eventLog: [...state.eventLog, action.payload]
            }
        default:
            return state
    }
}
