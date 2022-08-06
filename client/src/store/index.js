import axios from 'axios';
import { handleRequests } from '@redux-requests/core';
import { createDriver } from '@redux-requests/axios';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { localStorage } from 'redux-persist-webextension-storage';
import thunk from 'redux-thunk';
import APP_CONFIGS from '../config';
import userReducer from './reducers/userReducer';
import signerReducer from './reducers/signerReducer';
import keysManagerReducer from './reducers/keysManager';
import tokensReducer from './reducers/tokens';
import nftsReducer from './reducers/nfts';
import deployReducer from './reducers/deploys';
import stakeReducer from './reducers/stakes';
import requestReducer from './reducers/request';
import settingsReducer from './reducers/settings';
import createWalletReducer, { initialState as createWalletInitialState } from "./reducers/createWallet";
import { REQUEST } from './actionTypes';

const persistConfig = {
  key: 'root',
  storage: localStorage,
  // Not storing these
  blacklist: ["createWallet"]
}

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
	settings: {
		theme: '',
	},
	nfts: {
		address: [],
	},
  createWallet: {
    ...createWalletInitialState
  }
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
		throw error;
	},
	onAbort: (action, store) => {
		store.dispatch(removeLoadingStatus(action.type));
	},
});

const rootReducers = combineReducers({
	user: userReducer,
	signer: signerReducer,
	keysManager: keysManagerReducer,
	tokens: tokensReducer,
	requests: requestsReducer,
	deploys: deployReducer,
	stakes: stakeReducer,
	request: requestReducer,
	settings: settingsReducer,
	nfts: nftsReducer,
  createWallet: createWalletReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const persistedReducer = persistReducer(persistConfig, rootReducers);
const store = createStore(persistedReducer, initialState, composeEnhancers(
  applyMiddleware(thunk, ...requestsMiddleware)
));
let persistor = persistStore(store);
export { persistor };
export default store;
