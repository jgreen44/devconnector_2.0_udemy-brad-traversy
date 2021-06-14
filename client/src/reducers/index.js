import {combineReducers} from "redux";
import alert from './alert';

const rootReducer = combineReducers({
    alert: alert
})

export default rootReducer;