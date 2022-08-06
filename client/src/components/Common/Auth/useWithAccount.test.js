
import React from "react";
import { renderHook } from '@testing-library/react-hooks';
// import * as reactRouterDom from 'react-router-dom';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';
import useWithAccount from "./useWithAccount";

// pay attention to write it at the top level of your file
let mockUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  // ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
	useEffect: (callback) => callback(),
}));

jest.mock("@cd/actions/userActions.utils", () => ({
  getConnectedAccountChromeLocalStorage: jest.fn()
}))

// beforeAll(() => {
//   console.log("@ beforeAll")
//   jest.spyOn(React, 'useEffect').mockImplementation(React.useLayoutEffect)
// }
// )
// afterAll(() => React.useEffect.mockRestore())

describe("useWithAccount", () => {
  beforeEach(() => {
    getConnectedAccountChromeLocalStorage.mockReset();
    mockUsedNavigate.mockReset();
  })
  it('Should return nothing when being called', () => {
    getConnectedAccountChromeLocalStorage.mockResolvedValue({
      publicKey: "abc",
      loginOptions: {}
    });
		const { result } = renderHook(() => useWithAccount());

		expect(result.current).toBeUndefined();
	});

  it("XX", () => {
    getConnectedAccountChromeLocalStorage.mockResolvedValue({});
    mockUsedNavigate.mockReturnValue(value => { console.log(">> Mock: ", value); });
    renderHook(() => useWithAccount());
    
    expect(mockUsedNavigate).toHaveBeenCalled();
    expect(mockUsedNavigate).toHaveBeenCalledWith("/connectAccount");
  });

  it.skip("YY", () => {
    // const spyOnUseNavigate = jest.spyOn(reactRouterDom, "useNavigate");
    getConnectedAccountChromeLocalStorage.mockResolvedValue({
      publicKey: "",
      loginOptions: { userInfo: "abc", userHashingOptions: "Test"}
    });
    mockUsedNavigate.mockReturnValue(value => value);
    // const mockNavigate = jest.fn();
    // spyOnUseNavigate.mockReturnValue(mockNavigate)
    // useNavigate.mockReturnValue(value => value);
    renderHook(() => useWithAccount());
    
    // console.log(`🚀 ~ it.only ~ mockedUsedNavigate`, mockedUsedNavigate)
    // console.log(`🚀 ~ it.only ~ mockUsedNavigate`, mockUsedNavigate)
    expect(mockUsedNavigate).toHaveBeenCalled();
    expect(mockUsedNavigate).toHaveBeenLastCalledWith("/welcomeBack");
  });
});
