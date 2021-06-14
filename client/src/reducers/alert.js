import {SET_ALERT, REMOVE_ALERT} from "../actions/types";

const initialState = [];

export default function (state = initialState, action) {

    switch (action.type) {
        case SET_ALERT:
            // state is immutable so include any other state by using spread operator (...)
            return [...state, action.payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== action.payload.id);
        default:
            return state;
    }
}