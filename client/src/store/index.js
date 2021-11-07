import axios from 'axios';
import { handleRequests } from '@redux-requests/core';
import { createDriver } from '@redux-requests/axios';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import APP_CONFIGS from '../config';
import thunk from 'redux-thunk';
import userReducer from './reducers/userReducer';
import signerReducer from './reducers/signerReducer';
import keysManagerReducer from './reducers/keysManager';
import tokensReducer from './reducers/tokens';
import deployReducer from './reducers/deploys';
import requestReducer from './reducers/request';
import { REQUEST } from './actionTypes';

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
	keysManager: {},
	tokens: {
		address: [],
	},
	deploys: {
		transfers: [],
	},
	request: {
		isLoading: [],
	},
};

const setLoadingStatus = (actionType) => {
	return { type: REQUEST.ADD_REQUEST_LOADING_STATUS, payload: actionType };
};

const removeLoadingStatus = (actionType) => {
	return { type: REQUEST.REMOVE_REQUEST_LOADING_STATUS, payload: actionType };
};

const { requestsReducer, requestsMiddleware } = handleRequests({
	driver: createDriver(
		axios.create({
			baseURL: APP_CONFIGS.API_ROOT,
		}),
	),
	onRequest: (request, action, store) => {
		store.dispatch(setLoadingStatus(action.type));
		return request;
	},
	onSuccess: (response, action, store) => {
		store.dispatch(removeLoadingStatus(action.type));
		return response;
	},
	onError: (error, action, store) => {
		store.dispatch(removeLoadingStatus(action.type));
		return error;
	},
	onAbort: (action, store) => {
		store.dispatch(removeLoadingStatus(action.type));
	},
});

const main = combineReducers({
	user: userReducer,
	signer: signerReducer,
	keysManager: keysManagerReducer,
	tokens: tokensReducer,
	requests: requestsReducer,
	deploys: deployReducer,
	request: requestReducer,
});

const logger = (store) => (next) => (action) => {
	console.log('dispatching', action);
	let result = next(action);
	console.log('next state', store.getState());
	return result;
};

var store = createStore(main, initialState, applyMiddleware(thunk, ...requestsMiddleware));
export default store;
