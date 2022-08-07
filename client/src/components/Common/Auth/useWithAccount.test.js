import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
// import * as reactRedux from "react-redux";
import { cleanup } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';
import { getPublicKey, getLoginOptions } from '@cd/selectors/user';
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

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn() 
}))

jest.mock("@cd/selectors/user", () => ({
  getPublicKey: jest.fn(),
  getLoginOptions: jest.fn()
}))

// https://stackoverflow.com/questions/56085458/testing-custom-hook-with-react-hooks-testing-library-throws-an-error

describe("useWithAccount", () => {
  const mockNavigate = jest.fn(to => {
    console.log('Mock navigating to:: ', to);
  });
 
  beforeEach(() => {
    mockNavigate.mockClear();
  });
  afterEach(cleanup);
 
  it.skip('Should return nothing when being called first time', async () => {
    // const useSelector = jest.spyOn(reactRedux, 'useSelector');
    // getPublicKey.mockImplementation(() => "zzzz");
    // getLoginOptions.mockImplementation(() => ({ userInfo: "hihi" }));
    useSelector
      .mockImplementation(() => ({
        publicKey: "abc",
        loginOptions: {}
      }));
    useNavigate.mockImplementation(() => mockNavigate);
    getConnectedAccountChromeLocalStorage.mockResolvedValue({
      publicKey: "abc",
      loginOptions: {}
    });
    const { waitForNextUpdate, result } = renderHook(() => useWithAccount());
    await waitForNextUpdate();
    expect(result.current).toBeUndefined();
  });

  it.skip("Should redirect user back to /connectAccount screen when not found any cached User info", async () => {
    useSelector
      .mockImplementation(() => ({
        publicKey: "abc",
        loginOptions: {}
      }));
    useNavigate.mockImplementation(() => mockNavigate);
    getConnectedAccountChromeLocalStorage
      .mockResolvedValueOnce({}); 
  
    const { waitForNextUpdate } = renderHook(() => useWithAccount());
    
    await waitForNextUpdate();
    
    expect(useNavigate).toHaveBeenCalled();
    expect(mockNavigate).toBeCalledTimes(1); 
    expect(mockNavigate).toHaveBeenCalledWith("/connectAccount");
  });

  it.skip("Should redirect user back to /welcomeBack screen when found cached User info with empty public key", async () => {
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
