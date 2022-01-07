import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setPublicKey } from '../../actions/userActions';
import { getLedgerPublicKey, getLedgerError, initLedgerApp } from '../../services/ledgerServices';
import { getLoginOptions } from '../../selectors/user';
import { CONNECTION_TYPES } from '../../constants/settings';
import { SECP256k1, MAX_KEY_PATH } from '../../constants/ledger';

const useLedger = () => {
	// Hook
	const dispatch = useDispatch();

	// Selector
	const loginOptions = useSelector(getLoginOptions);
	const { casperApp: currentCasperApp } = loginOptions;
	const isUsingLedger = loginOptions.connectionType === CONNECTION_TYPES.ledger;

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
			dispatch(
				setPublicKey(key, {
					connectionType: CONNECTION_TYPES.ledger,
					casperApp,
					keyPath: 0,
				}),
			);

			typeof callback === 'function' && callback();
			return { casperApp, keyPath: 0 };
		} catch (error) {
			toast.error(getLedgerError(error));
		}
	};

	const loadMoreKeys = async (callback) => {
		if (!(await isLedgerConnected())) {
			toast.error('You must unlock the Casper App on your Ledger device to connect.');
			return false;
		}

		try {
			const ledgerKeys = [];
			for (let i = 0; i < MAX_KEY_PATH; i++) {
				const response = await getLedgerPublicKey(currentCasperApp, i);
				const { publicKey } = response;
				const key = `${SECP256k1}${publicKey.toString('hex')}`;
				ledgerKeys.push({ key, path: i });
			}
			typeof callback === 'function' && callback();

			return ledgerKeys;
		} catch (error) {
			toast.error(getLedgerError(error));
		}
	};

	return { handleConnectLedger, isUsingLedger, isLedgerConnected, loadMoreKeys };
};

export default useLedger;
