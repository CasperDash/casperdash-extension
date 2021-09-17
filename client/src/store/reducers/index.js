import { combineReducers } from 'redux';
import userReducer from './userReducer';
import signerReducer from './signerReducer';
// const reducers = {
// 	user: userReducer,
// 	signer: signerReducer,
// };

//export default reducers;

const reducers = combineReducers({
	user: userReducer,
	signer: signerReducer,
	AsyncSelectorLog: (state = null, action) => {
		if (action.type === 'RERENDER_APP') {
			return { ...state, [action.key]: action.value };
		}
		return state;
	},
});

const rootReducer = (state, action) => {
	return reducers(state, action);
};

export default rootReducer;
