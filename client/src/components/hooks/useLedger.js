import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setPublicKey } from '../../actions/userActions';
import { setLedgerOptions } from '../../actions/ledgerActions';
import { getLedgerPublicKey, getLedgerError, initLedgerApp } from '../../services/ledgerServices';

const useLedger = () => {
	// Hook
	const dispatch = useDispatch();

	// Function
	const handleConnectLedger = async () => {
		try {
			const app = await initLedgerApp();
			const response = await getLedgerPublicKey(app);
			if (!response.publicKey) {
				toast.error('You must unlock the Casper App on your Ledger device to connect.');
				return;
			}

			const key = `02${response.publicKey.toString('hex')}`;
			dispatch(setPublicKey(key));
			dispatch(
				setLedgerOptions({
					app,
				}),
			);
		} catch (error) {
			toast.error(getLedgerError(error));
		}
	};

	return { handleConnectLedger };
};

export default useLedger;
