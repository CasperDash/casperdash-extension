import { mainRoutes, wrapperRoutes } from '../shared/constants';
import Home from './Home';
import { CreateWallet } from './Accounts/CreateWallet';
import Wallets from './Wallets';
import History from './History';
import KeyManager from './KeyManager';
import Tokens from './Tokens';

const mainModulesMapping = {
	[mainRoutes.dashboard]: Wallets,
	[mainRoutes.tokens]: Tokens,
	[mainRoutes.history]: History,
	[mainRoutes.keyManager]: KeyManager,
};

const wrapperModulesMapping = {
	[wrapperRoutes.home]: Home,
	[wrapperRoutes.login]: Home,
	[wrapperRoutes.newwallet]: CreateWallet,
};

const getModules = (moduleMapping) =>
	Object.keys(moduleMapping).reduce((out, module) => {
		return module !== 'undefined' ? { ...out, [module]: moduleMapping[module] } : out;
	}, {});

export const mainModules = getModules(mainModulesMapping);
export const wrapperModules = getModules(wrapperModulesMapping);
