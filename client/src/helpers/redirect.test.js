import { viewInExplorer } from './redirect';

test('viewInExplorer', () => {
	global.open = jest.fn();
	viewInExplorer({ type: 'deploy', value: 'test' });
	expect(global.open).toBeCalled();
});
