import { useState } from "react";
import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
// import * as reactRedux from "react-redux";
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
  useState: jest.fn(),
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
    useState.mockClear();
    useSelector.mockClear();
  });
  afterEach(cleanup);

  it('Should return nothing when being called first time', async () => {
    // const useSelector = jest.spyOn(reactRedux, 'useSelector');
    useState.mockImplementationOnce(() => [false, jest.fn()]).mockImplementationOnce(() => [{
        publicKey: "abc",
        loginOptions: {
          userHashingOptions: "1"
        }
      }, jest.fn()]);
    useSelector
      .mockImplementation(() => ({
        publicKey: "abc",
        loginOptions: {
          userHashingOptions: "1"
        }
      }));
    useNavigate.mockImplementation(() => mockNavigate);
    getConnectedAccountChromeLocalStorage.mockResolvedValue({
      publicKey: "abc",
      loginOptions: {
        userHashingOptions: "1"
      }
    }); 
    const { result } = renderHook(() => useWithAccount());
    expect(result.current).toEqual({
      publicKey: "abc",
      loginOptions: {
        userHashingOptions: "1"
      }
    });
  });

  it("Should redirect user back to /connectAccount screen when not found any cached User info", async () => {
    useState.mockImplementationOnce(() => [false, jest.fn()]).mockImplementationOnce(() => [{
      publicKey: "",
      loginOptions: {}
    }, jest.fn()]);
    useSelector
      .mockImplementation(() => ({
        publicKey: "",
        loginOptions: {}
      }));
    useNavigate.mockImplementation(() => mockNavigate);
    getConnectedAccountChromeLocalStorage
      .mockResolvedValueOnce({
        publicKey: "",
        loginOptions: {}
      }); 
  
    renderHook(() => useWithAccount());
    
    expect(useNavigate).toHaveBeenCalled();
    expect(mockNavigate).toBeCalledTimes(1); 
    expect(mockNavigate).toHaveBeenCalledWith("/connectAccount");
  });

  it("Should redirect user back to /welcomeBack screen when found cached User info with empty public key", async () => {
    useState.mockImplementationOnce(() => [false, jest.fn()]).mockImplementationOnce(() => [{
      publicKey: "",
      loginOptions: {
        userHashingOptions: "Test"
      }
    }, jest.fn()]);
    useSelector
      .mockImplementation(() => ({
        publicKey: "",
        loginOptions: {
          userHashingOptions: "Test"
        }
      }));
    useNavigate.mockImplementation(() => mockNavigate);
    getConnectedAccountChromeLocalStorage
      .mockResolvedValueOnce({
        publicKey: "",
        loginOptions: { userHashingOptions: "Test"}
      }); 
    
    renderHook(() => useWithAccount());
    
    expect(useNavigate).toHaveBeenCalled();
    expect(mockNavigate).toBeCalledTimes(1); 
    expect(mockNavigate).toHaveBeenCalledWith("/welcomeBack");
  });
});
