import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import WithAccount from './WithAccount';

jest.mock('react', () => ({
	useEffect: (callback) => callback(),
}));

jest.mock("@cd/actions/userActions", () => ({
  getConnectedAccountLocalStorage: () => ({
    publicKey: "abc",
    loginOptions: {}
  })
}))

test('should redirect to connect page', () => {
	const value = WithAccount({ children: 'test' });
	expect(value).toEqual('test');
	expect(useNavigate()).toHaveBeenCalled();
});

test('should render children', () => {
	useSelector.mockReturnValue('mockPublicKey');
	const value = WithAccount({ children: 'test' });
	expect(value).toEqual('test');
});
