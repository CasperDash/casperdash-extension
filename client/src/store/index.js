import axios from 'axios';
import { handleRequests } from '@redux-requests/core';
import { createDriver } from '@redux-requests/axios';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import webLocalStorage from 'redux-persist/lib/storage';
import { localStorage as extensionLocalStorage } from 'redux-persist-webextension-storage';
import thunk from 'redux-thunk';
import { isUsingExtension } from '@cd/services/localStorage';
import { DEFAULT_AUTO_LOCK_TIME, NETWORK_NAME } from '@cd/constants/key';
import { getNetworkState } from '@cd/selectors/settings';
import APP_CONFIGS from '../config';
import userReducer from './reducers/userReducer';
import signerReducer from './reducers/signerReducer';
import keysManagerReducer from './reducers/keysManager';
import tokensReducer from './reducers/tokens';
import nftsReducer from './reducers/nfts';
import deployReducer from './reducers/deploys';
import stakeReducer from './reducers/stakes';
import loginModalReducer from './reducers/loginModal';
import settingsReducer from './reducers/settings';
import createWalletReducer, { initialState as createWalletInitialState } from './reducers/createWallet';

const isChromeExtension = isUsingExtension();
const persistConfig = {
	key: 'root',
	storage: isChromeExtension ? extensionLocalStorage : webLocalStorage,
	whitelist: ['settings', 'user'],
};

export const initialState = {
	user: {
		publicKey: '',
		accountIndex: 0,
		loginOptions: {},
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
		autoLockTime: DEFAULT_AUTO_LOCK_TIME,
		network: NETWORK_NAME,
	},
	nfts: {
		address: [],
	},
	createWallet: {
		...createWalletInitialState,
	},
};

const { requestsReducer, requestsMiddleware } = handleRequests({
	driver: createDriver(axios.create()),
	onRequest: (request, action, store) => {
		const network = getNetworkState(store.getState);

		const baseURL =
			APP_CONFIGS.APP_ENVIRONMENT === 'local'
				? APP_CONFIGS.API_ROOT
				: network === 'casper-test'
				? 'https://testnet-api.casperdash.io'
				: 'https://api.casperdash.io';

		return { ...request, baseURL: request.baseURL || baseURL };
	},
	cache: true,
});

const rootReducers = combineReducers({
	user: userReducer,
	signer: signerReducer,
	keysManager: keysManagerReducer,
	tokens: tokensReducer,
	requests: requestsReducer,
	deploys: deployReducer,
	stakes: stakeReducer,
	settings: settingsReducer,
	nfts: nftsReducer,
	createWallet: createWalletReducer,
	loginModal: loginModalReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const persistedReducer = persistReducer(persistConfig, rootReducers);
const store = createStore(
	persistedReducer,
	initialState,
	composeEnhancers(applyMiddleware(thunk, ...requestsMiddleware)),
);
let persistor = persistStore(store);
export { persistor };
export default store;
