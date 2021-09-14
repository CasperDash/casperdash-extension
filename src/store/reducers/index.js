import { combineReducers } from 'redux';
import userReducer from './userReducer';

const reducers = combineReducers({
	userAction: userReducer,
});

const rootReducer = (state, action) => {
	return reducers(state, action);
};

export default rootReducer;
