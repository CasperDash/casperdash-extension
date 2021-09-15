import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

export const initialState = {
	user: {
		publicKey: '',
		balance: null,
	},
	signer: {
		isConnected: false,
		isUnlocked: true,
		error: null,
	},
};

const logger = (store) => (next) => (action) => {
	console.log('dispatching', action);
	let result = next(action);
	console.log('next state', store.getState());
	return result;
};

var store = createStore(reducers, initialState, applyMiddleware(thunk, logger));
export default store;
