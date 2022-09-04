import { isUsingExtension } from './localStorage';

describe('isUsingExtension', () => {
	describe('TRUE', () => {
		beforeEach(() => {
			global.chrome = {
				storage: {
					local: {},
				},
			};
		});
		it('Should return true when being called in Chrome extension', () => {
			expect(isUsingExtension()).toBeTrue;
		});
	});
	describe('FALSE', () => {
		it('Should return false when being called in Firefox/Safari', () => {
			global.chrome = undefined;
			expect(isUsingExtension()).toBeFalse;
		});
	});
});
