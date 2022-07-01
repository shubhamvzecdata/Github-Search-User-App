import { combineReducers } from 'redux';

import Favorite from './Favorte_reducer';
import Users from './Users_Reducer';

const rootReducer = combineReducers({
    Favorite,
    Users
})

export default rootReducer;

