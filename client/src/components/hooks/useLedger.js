import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setPublicKey } from '../../actions/userActions';
import { getLedgerPublicKey, getLedgerError, initLedgerApp, getListKeys } from '../../services/ledgerServices';
import { setLocalStorageValue, getLocalStorageValue } from '../../services/localStorage';
import { getLoginOptions } from '../../selectors/user';
import { CONNECTION_TYPES } from '../../constants/settings';
import { MAX_KEY_PATH } from '../../constants/ledger';

const useLedger = () => {
	// Hook
	const dispatch = useDispatch();

	// Selector
	const loginOptions = useSelector(getLoginOptions);
	const isUsingLedger = loginOptions.connectionType === CONNECTION_TYPES.ledger;

	// Function
	const handleConnectLedger = async () => {
		// TODO: show list of keys for user to chose at initial
		const { casperApp, transport } = await initLedgerApp();
		try {
			const publicKey = await getLedgerPublicKey(casperApp);

			dispatch(
				setPublicKey(publicKey, {
					connectionType: CONNECTION_TYPES.ledger,
					keyIndex: 0,
				}),
			);
			transport.close();
			// should close transport
			return { keyIndex: 0, publicKey };
		} catch (error) {
			console.error(console.error);
			toast.error(getLedgerError(error));
		}
		transport.close();
	};

	const loadMoreKeys = async (publicKey, index = 0) => {
		const { casperApp, transport } = await initLedgerApp();

		try {
			const cachedKeys = getLocalStorageValue('ledger', 'keys');
			// Check if keys are already loaded
			if (
				cachedKeys &&
				cachedKeys.length &&
				cachedKeys.find((key) => key.publicKey === publicKey) &&
				cachedKeys.length < index
			) {
				return cachedKeys;
			}
			//TODO: get balance for each key
			const listKeys = await getListKeys(casperApp, index, MAX_KEY_PATH);
			// Cache keys to local storage
			setLocalStorageValue('ledger', 'keys', listKeys, 'set');
			transport.close();
			return listKeys;
		} catch (error) {
			console.error(console.error);
			toast.error(getLedgerError(error));
		}
		transport.close();
		return [];
	};

	return { handleConnectLedger, isUsingLedger, loadMoreKeys };
};

export default useLedger;
