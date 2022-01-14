import { useSelector } from 'react-redux';
import { useDeploysWithStatus } from './useTransferDeploys';

jest.mock('react', () => ({ useEffect: jest.fn() }));

test('Should return all deploys', () => {
	useSelector.mockReturnValue({}).mockReturnValueOnce([{ symbol: 'CSPR', status: 'pending' }]);

	const deploys = useDeploysWithStatus();
	expect(deploys).toEqual([{ symbol: 'CSPR', status: 'pending' }]);
});

test('Should return CSPR token  deploys', () => {
	useSelector.mockReturnValue({}).mockReturnValueOnce([
		{ symbol: 'CSPR', status: 'pending' },
		{ symbol: 'TEST', status: 'pending' },
	]);

	const deploys = useDeploysWithStatus({ symbol: 'CSPR' });
	expect(deploys).toEqual([{ symbol: 'CSPR', status: 'pending' }]);
});

test('Should return pending  deploys', () => {
	useSelector.mockReturnValue({}).mockReturnValueOnce([
		{ symbol: 'CSPR', status: 'pending' },
		{ symbol: 'TEST', status: 'pending' },
		{ symbol: 'TEST', status: 'success' },
	]);

	const deploys = useDeploysWithStatus({ status: 'pending' });
	expect(deploys).toEqual([
		{ symbol: 'CSPR', status: 'pending' },
		{ symbol: 'TEST', status: 'pending' },
	]);
});
