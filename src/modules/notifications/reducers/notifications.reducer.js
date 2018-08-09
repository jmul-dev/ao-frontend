
// Constants
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
export const DISMISS_NOTIFICATION = 'DISMISS_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'


// Actions
export const addNotification = ({message, action, variant}) => {
    return (dispatch, getState) => {                
        const id = getState().notifications.idIncrementer
        dispatch({
            type: ADD_NOTIFICATION,
            payload: { id, message, action, variant }
        })
        return id
    }    
}
export const dismissNotification = (id) => {
    return (dispatch, getState) => {
        dispatch({
            type: DISMISS_NOTIFICATION,
            payload: { id }
        })
        setTimeout(() => {
            dispatch({
                type: REMOVE_NOTIFICATION,
                payload: { id }
            })
        }, 300)
    }
}

// State
const initialState = {
    idIncrementer: 1,
    notifications: []
}

// Reducer
export default function notificationsReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_NOTIFICATION:
            return {
                ...state,
                idIncrementer: state.idIncrementer + 1,
                notifications: state.notifications.concat([action.payload]),                
            }
        case DISMISS_NOTIFICATION: {
            // Set the notification to closed
            let updatedNotifications = state.notifications.map(notification => {
                if ( notification.id === action.payload.id ) {
                    return {
                        ...notification,
                        dismiss: true,
                    }
                }
                return notification
            })            
            return {
                ...state,
                notifications: updatedNotifications,                
            }
        }
        case REMOVE_NOTIFICATION: {
            let updatedNotifications = state.notifications.filter(notification => notification.id !== action.payload.id)
            return {
                ...state,
                notifications: updatedNotifications,
            }
        }
        default:
            return state
    }
}
