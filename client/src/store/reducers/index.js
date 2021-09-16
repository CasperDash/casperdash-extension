import { combineReducers } from 'redux';
import userReducer from './userReducer';
import signerReducer from './signerReducer';

const reducers = combineReducers({
	user: userReducer,
	signer: signerReducer,
});

const rootReducer = (state, action) => {
	return reducers(state, action);
};

export default rootReducer;
