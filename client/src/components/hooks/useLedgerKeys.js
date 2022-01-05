import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setLedgerOptions } from '../../actions/ledgerActions';
import { getLedgerError, getLedgerPublicKey } from '../../services/ledgerServices';
import { getLedgerOptions } from '../../selectors/ledgerOptions';
import { SECP256k1 } from '../../constants/ledger';
import useLedger from './useLedger';

const MAX_KEY_PATH = 9;

const useLedgerKeys = () => {
	// Hook
	const dispatch = useDispatch();
	const { isLedgerConnected } = useLedger();

	// Selector
	const { casperApp, ledgerKeys } = useSelector(getLedgerOptions);

	// Function
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

	return { loadMoreKeys };
};

export default useLedgerKeys;
