//import { routes } from '../shared/constants';
import modules from './index';

jest.mock('./Wallets', () => {
	return {
		__esModules: true,
		default: '',
	};
});
jest.mock('./History', () => {
	return {
		__esModules: true,
		default: '',
	};
});
jest.mock('./KeyManager', () => {
	return {
		__esModules: true,
		default: '',
	};
});
jest.mock('./Tokens', () => {
	return {
		__esModules: true,
		default: '',
	};
});
jest.mock('./NFTs', () => {
	return {
		__esModules: true,
		default: '',
	};
});

jest.mock('./Stake', () => {
	return {
		__esModules: true,
		default: '',
	};
});

jest.mock('./NFTs/CreateNFTs', () => {
	return {
		__esModules: true,
		default: '',
	};
});
jest.mock('../../shared/constants', () => {
	return {
		routes: { dashboard: '/dashboard', nfts: '/NFTs' },
	};
});

test('Should return available modules', () => {
	expect(Object.keys(modules)).toEqual(['/dashboard', '/NFTs']);
});
