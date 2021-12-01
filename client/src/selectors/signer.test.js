import { Signer } from 'casper-js-sdk';
import { isConnectedCasper, isLockedCasper, getConnectError, getSignerStatus } from './signer';

const spyOnIsConnected = jest.spyOn(Signer, 'isConnected');
const spyOnGetActivePublicKey = jest.spyOn(Signer, 'getActivePublicKey');

test('isConnectedCasper should return undefined if error', async () => {
	const isConnected = await isConnectedCasper();
	expect(spyOnIsConnected).toHaveBeenCalled();
	expect(isConnected).toBe(undefined);
});

test('isConnectedCasper should return connected status', async () => {
	spyOnIsConnected.mockReturnValue(true);
	const isConnected = await isConnectedCasper();
	expect(spyOnIsConnected).toHaveBeenCalled();
	expect(isConnected).toBe(true);
});

test('isLockedCasper should return true if error', async () => {
	const isLocked = await isLockedCasper();
	expect(spyOnGetActivePublicKey).toHaveBeenCalled();
	expect(isLocked).toBe(true);
});

test('isLockedCasper should return false if can get public key', async () => {
	spyOnGetActivePublicKey.mockReturnValue('plkey');
	const isLocked = await isLockedCasper();
	expect(spyOnGetActivePublicKey).toHaveBeenCalled();
	expect(isLocked).toBe(false);
});

test('getConnectError should return connection error', async () => {
	expect(getConnectError({ signer: { error: 'error' } })).toBe('error');
});

test('getSignerStatus should return connection status', async () => {
	const mockSinger = {
		isUnlocked: jest.fn(),
		isConnected: jest.fn(),
	};
	global.casperlabsHelper = mockSinger;

	expect(getSignerStatus({ signer: { isUnlocked: true, isConnected: false } })).toEqual({
		isUnlocked: true,
		isConnected: false,
		isAvailable: true,
	});
});
