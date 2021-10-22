import { USERS } from '../actionTypes';
export default function userReducer(
	state = {
		publicKey: '',
		selectedWallet: {},
		cryptoInstance: null,
	},
	action,
) {
	switch (action.type) {
		case USERS.SET_USER_ADDRESS:
			return { ...state, publicKey: action.payload.publicKey };
		case USERS.SET_SELECTED_WALLET:
			const wallet = action.payload;

			return {
				...state,
				publicKey: wallet && wallet.publicKey ? wallet.publicKey.toHex() : '',
				selectedWallet: wallet,
			};
		case USERS.UPDATE_CRYPTO_INSTANCE:
			return { ...state, cryptoInstance: action.payload };
		default:
			return state;
	}
}
