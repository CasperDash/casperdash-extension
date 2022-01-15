import { useSelector } from 'react-redux';
import { useTokenInfo } from './useTokensInfo';

jest.mock('react', () => ({ useEffect: jest.fn() }));

test('Should return token info', () => {
	useSelector
		.mockReturnValue({})
		.mockReturnValueOnce({})
		.mockReturnValueOnce({})
		.mockReturnValueOnce([{ address: 'CSPR', symbol: 'CSPR' }])
		.mockReturnValueOnce({ address: 'CSPR', symbol: 'CSPR' })
		.mockReturnValueOnce(false);
	const { allTokenInfo, tokenInfoByAddress, isFetching } = useTokenInfo();
	expect(allTokenInfo).toEqual([{ address: 'CSPR', symbol: 'CSPR' }]);
	expect(tokenInfoByAddress).toEqual({ address: 'CSPR', symbol: 'CSPR' });
	expect(isFetching).toEqual(false);
});
