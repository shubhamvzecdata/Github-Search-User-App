import { RE_USER_STATE } from '../Actions';

const initialSTATE = { isAuthenticated:Boolean }

function Users( state = initialSTATE, action ) {
    switch(action.type){
        case RE_USER_STATE:
            state.isAuthenticated = action.payload;
            return state;
        default:
            return state;
    }
}


export default Users;
