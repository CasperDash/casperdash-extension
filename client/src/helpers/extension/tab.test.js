import { isPopupMode } from './tab';

test('isPopupMode', () => {
	expect(isPopupMode()).toBe(false);
});
