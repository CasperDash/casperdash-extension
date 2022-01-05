import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setPublicKey } from '../../actions/userActions';
import { setLedgerOptions } from '../../actions/ledgerActions';
import { getLedgerPublicKey, getLedgerError, initLedgerApp } from '../../services/ledgerServices';
import { CONNECTION_TYPES } from '../../constants/settings';
import { getLedgerOptions } from '../../selectors/ledgerOptions';
import { SECP256k1, MAX_KEY_PATH } from '../../constants/ledger';

const useLedger = () => {
	// Hook
	const dispatch = useDispatch();

	// Selector
	const { ledgerKeys, casperApp } = useSelector(getLedgerOptions);

	const isUsingLedger = ledgerKeys && ledgerKeys.length > 0;

	// Function
	const isLedgerConnected = async () => {
		try {
			const app = await initLedgerApp();
			const response = await getLedgerPublicKey(app);
			return response.publicKey ? response.publicKey : false;
		} catch {
			return false;
		}
	};

	const logOutLedger = () => {
		dispatch(setPublicKey(null));
		dispatch(
			setLedgerOptions({
				casperApp: null,
				ledgerKeys: [],
				keyPath: 0,
			}),
		);
	};

	const handleConnectLedger = async (callback) => {
		try {
			const casperApp = await initLedgerApp();
			const response = await getLedgerPublicKey(casperApp);
			const { publicKey } = response;
			if (!publicKey) {
				toast.error('You must unlock the Casper App on your Ledger device to connect.');
				return;
			}

			const key = `${SECP256k1}${publicKey.toString('hex')}`;
			dispatch(setPublicKey(key, CONNECTION_TYPES.ledger));
			dispatch(
				setLedgerOptions({
					casperApp,
					ledgerKeys: [{ key, keyPath: 0 }],
				}),
			);
			typeof callback === 'function' && callback();
		} catch (error) {
			toast.error(getLedgerError(error));
		}
	};

	const loadMoreKeys = async (callback) => {
		// Do not load again if loaded key paths before.
		if (ledgerKeys && ledgerKeys.length === MAX_KEY_PATH) {
			return ledgerKeys;
		}

		if (!(await isLedgerConnected())) {
			toast.error('You must unlock the Casper App on your Ledger device to connect.');
			return false;
		}

		try {
			const ledgerKeys = [];
			for (let i = 0; i < MAX_KEY_PATH; i++) {
				const response = await getLedgerPublicKey(casperApp, i);
				const { publicKey } = response;
				const key = `${SECP256k1}${publicKey.toString('hex')}`;
				ledgerKeys.push({ key, path: i });
			}
			typeof callback === 'function' && callback();
			dispatch(
				setLedgerOptions({
					casperApp,
					ledgerKeys,
				}),
			);
			return ledgerKeys;
		} catch (error) {
			toast.error(getLedgerError(error));
		}
	};

	return { handleConnectLedger, isUsingLedger, isLedgerConnected, logOutLedger, loadMoreKeys };
};

export default useLedger;
