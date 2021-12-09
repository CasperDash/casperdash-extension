import { formatKeyByPrefix } from './key';

test('formatKeyByPrefix', () => {
	expect(formatKeyByPrefix('account-hash-1123123123')).toEqual('1123123123');
	expect(formatKeyByPrefix('uref-1123123123')).toEqual('1123123123');
	expect(formatKeyByPrefix('test-1123123123')).toEqual('test-1123123123');
});
