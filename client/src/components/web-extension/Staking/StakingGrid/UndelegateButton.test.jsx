import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { UndelegateButton } from './UndelegateButton';

afterEach(cleanup);

test('Should show undelegate button', async () => {
	const { getByText } = render(<UndelegateButton text="Undelegate" />);
	expect(getByText('Undelegate').textContent).toBe('Undelegate');
	await fireEvent.click(getByText('Undelegate'));
	expect(useNavigate()).toHaveBeenCalled;
});
