import { renderHook } from '@testing-library/react-hooks';
import { cleanup } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';
import useWithAccount from "./useWithAccount";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

const { useNavigate }  = reactRouterDom;

jest.mock('react', () => ({
  ...jest.requireActual('react'),
	useEffect: (callback) => callback(),
}));

jest.mock("@cd/actions/userActions.utils", () => ({
  getConnectedAccountChromeLocalStorage: jest.fn()
}));

// https://stackoverflow.com/questions/56085458/testing-custom-hook-with-react-hooks-testing-library-throws-an-error

describe("useWithAccount", () => {
  const mockNavigate = jest.fn(to => {
    console.log('Mock navigating to:: ', to);
  });

  beforeEach(() => {
    mockNavigate.mockClear();
  });
  afterEach(cleanup);

  it('Should return nothing when being called first time', () => {
    useNavigate.mockImplementation(() => mockNavigate);
    getConnectedAccountChromeLocalStorage.mockResolvedValue({
      publicKey: "abc",
      loginOptions: {}
    });
    const { result } = renderHook(() => useWithAccount());

    expect(result.current).toBeUndefined();
  });

  it("Should redirect user back to /connectAccount screen when not found any cached User info", async () => {
    
    useNavigate.mockImplementation(() => mockNavigate);
    getConnectedAccountChromeLocalStorage
      .mockResolvedValueOnce({}); 
  
    const { waitForNextUpdate } = renderHook(() => useWithAccount());
    
    await waitForNextUpdate();
    
    expect(useNavigate).toHaveBeenCalled();
    expect(mockNavigate).toBeCalledTimes(1); 
    expect(mockNavigate).toHaveBeenCalledWith("/connectAccount");
  });

  it("Should redirect user back to /welcomeBack screen when found cached User info with empty public key", async () => {
    useNavigate.mockImplementation(() => mockNavigate);
    getConnectedAccountChromeLocalStorage
      .mockResolvedValueOnce({
        publicKey: "",
        loginOptions: { userInfo: "abcd", userHashingOptions: "Test"}
      }); 
    
    const { waitForNextUpdate } = renderHook(() => useWithAccount());
    
    await waitForNextUpdate();
    
    expect(useNavigate).toHaveBeenCalled();
    expect(mockNavigate).toBeCalledTimes(1); 
    expect(mockNavigate).toHaveBeenCalledWith("/welcomeBack");
  });
});
