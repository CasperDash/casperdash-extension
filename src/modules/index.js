import { routes } from '../shared/constants';
import Wallets from './Wallets';
import History from './History';

export default {
	[routes.dashboardpage]: Wallets,
	[routes.historypage]: History,
};
