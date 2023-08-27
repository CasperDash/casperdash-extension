import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { UndelegateButton } from './UndelegateButton';

afterEach(cleanup);

test('Should show actions button', async () => {
	const { getByText } = render(<UndelegateButton text="Undelegate" />);
	expect(getByText('Actions').textContent).toBe('Actions');
	await fireEvent.click(getByText('Actions'));
	expect(useNavigate()).toHaveBeenCalled;
});
