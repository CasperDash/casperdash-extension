import _set from 'lodash-es/set';
import _get from 'lodash-es/get';
import { setLocalStorageValue, getLocalStorageValue } from './localStorage';

jest.mock('lodash-es/set', () => {
	return {
		__esModule: true,
		default: jest.fn(),
	};
});

jest.mock('lodash-es/get', () => {
	return {
		__esModule: true,
		default: jest.fn(),
	};
});
const spySet = jest.spyOn(Storage.prototype, 'setItem');
const spyGet = jest.spyOn(Storage.prototype, 'getItem');
describe('setLocalStorageValue', () => {
	test('Should set value', () => {
		const updatedItem = setLocalStorageValue('test', 'value', { value: 'test' }, 'set');
		expect(spyGet).toHaveBeenCalled();
		expect(spyGet).toBeCalledWith('test');
		expect(spySet).toHaveBeenCalled();
		expect(spySet).toBeCalledWith('test', undefined);
		expect(_set).toHaveBeenCalled();
		expect(_set).toBeCalledWith({}, 'value', { value: 'test' });
		expect(updatedItem).toEqual();
	});
	test('Should push value', () => {
		_get.mockReturnValue([]);
		const updatedItem = setLocalStorageValue('test1', 'test.path', 'testValue', 'push');
		expect(spyGet).toHaveBeenCalled();
		expect(spyGet).toBeCalledWith('test1');
		expect(_get).toHaveBeenCalled();
		expect(_get).toBeCalledWith({}, 'test.path', []);
		expect(_set).toHaveBeenCalled();
		expect(_set).toBeCalledWith({}, 'test.path', ['testValue']);
		expect(spySet).toHaveBeenCalled();
		expect(spySet).toBeCalledWith('test1', undefined);
		expect(updatedItem).toEqual();
	});
	test('Should log error if exception', () => {
		_get.mockReturnValue([]);
		spyGet.mockReturnValue('undefined');
		let value;
		try {
			value = setLocalStorageValue('test2', 'test.path', 'testValue', 'push');
		} catch (error) {
			expect(error.message).toEqual('Unexpected token u in JSON at position 0');
			expect(value).toEqual(undefined);
		}
	});
	test('Should log error if exception', () => {
		_get.mockReturnValue([]);
		spyGet.mockReturnValue('[]');
		const value = setLocalStorageValue('test2', 'test.path', 'testValue', 'test');
		expect(value).toEqual([]);
	});
});

test('getLocalStorageValue', () => {
	getLocalStorageValue('testget', 'path');
	expect(spyGet).toHaveBeenCalled();
	expect(spyGet).toBeCalledWith('testget');
	expect(_get).toHaveBeenCalled();
});

test('Should return undefined if error', () => {
	spyGet.mockReturnValue('undefined');
	let value = 'value';
	try {
		getLocalStorageValue('testget', 'path');
	} catch (error) {
		expect(value).toBe(undefined);
	}
});
