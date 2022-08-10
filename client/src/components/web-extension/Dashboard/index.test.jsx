import React from 'react';
import * as redux from 'react-redux';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import DashBoard from './';

jest.mock("@cd/web-extension/Common/Account", () => ({
  AccountInfo: () => (<div>Account 1</div>)
}));

// eslint-disable-next-line
jest.mock("@cd/web-extension/Common/OverlayLoader", () => () => (<div>Loading...</div>))

jest.mock('../../hooks/useTokensInfo', () => ({
	useTokenInfo: () => ({
		allTokenInfo: [{ symbol: 'CSPR', balance: { displayValue: 11 }, totalPrice: 10, price: 0.2 }],
	}),
}));


describe("WalletDetails", () => {
  let spyOnUseSelector;
  afterEach(cleanup);
  beforeEach(() => {
    spyOnUseSelector = jest.spyOn(redux, 'useSelector');
    spyOnUseSelector.mockClear();
  });

  describe("Without publicKey", () => {
    it("Should render only Loading component", () => {
      spyOnUseSelector.mockReturnValue({ publicKey: ""});
      const { queryByText } = render(<DashBoard />);
      expect(queryByText(/Send/i)).not.toBeInTheDocument();
      expect(queryByText(/Loading.../i)).toBeInTheDocument();
    });
  });

  describe("With publicKey found", () => {
    it('Should render full WalletDetail page with token info', async () => {
      spyOnUseSelector.mockReturnValue({ publicKey: "test"});
      const { getByText } = render(<DashBoard />);
      expect(getByText(/Send/i).textContent).toBe('Send');
      expect(getByText(/Receive/i).textContent).toBe('Receive');
      expect(getByText(/Add Custom Token/i).textContent).toBe('+ Add Custom Token');
      expect(getByText(/CSPR/i).textContent).toBe('CSPR ');
      expect(getByText(/10/i).textContent).toBe('$10.00 ');
      expect(getByText(/11/i).textContent).toBe('11 ');
      expect(getByText(/0.2/i).textContent).toBe('$0.20 ');
      expect(getByText(/Account 1/i).textContent).toBe('Account 1');
      await fireEvent.click(getByText(/CSPR/i));
      expect(useNavigate()).toHaveBeenCalledTimes(1);
      expect(useNavigate()).toHaveBeenCalledWith('/token', {
        state: {
          token: {
            balance: {
              displayValue: 11,
            },
            price: 0.2,
            symbol: 'CSPR',
            totalPrice: 10,
          },
          name: 'CSPR',
        },
      });
      await fireEvent.click(getByText(/Add Custom Token/i));
      expect(useNavigate()).toHaveBeenCalledTimes(2);
      expect(useNavigate()).toHaveBeenCalledWith('/addToken', {
        state: { name: 'Add Token' },
      });
    });
  })
})
