import axios from 'axios';
import { handleRequests } from '@redux-requests/core';
import { createDriver } from '@redux-requests/axios';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { BASE_API_URL } from '../constants/key';
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

const { requestsReducer, requestsMiddleware } = handleRequests({
	driver: createDriver(
		axios.create({
			baseURL: BASE_API_URL,
		}),
	),
});

const main = combineReducers({
	user: reducers.userReducer,
	signer: reducers.signerReducer,
	requests: requestsReducer,
});

const logger = (store) => (next) => (action) => {
	console.log('dispatching', action);
	let result = next(action);
	console.log('next state', store.getState());
	return result;
};

var store = createStore(main, initialState, applyMiddleware(thunk, logger, ...requestsMiddleware));
export default store;
