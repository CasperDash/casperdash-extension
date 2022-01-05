import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setPublicKey } from '../../actions/userActions';
import { setLedgerOptions } from '../../actions/ledgerActions';
import { getLedgerPublicKey, getLedgerError, initLedgerApp } from '../../services/ledgerServices';
import { CONNECTION_TYPES } from '../../constants/settings';
import { getLedgerOptions } from '../../selectors/ledgerOptions';

const useLedger = () => {
	// Hook
	const dispatch = useDispatch();

	// Selector
	const { ledgerKeys } = useSelector(getLedgerOptions);

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

			const key = `02${publicKey.toString('hex')}`;
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

	return { handleConnectLedger, isUsingLedger, isLedgerConnected, logOutLedger };
};

export default useLedger;
