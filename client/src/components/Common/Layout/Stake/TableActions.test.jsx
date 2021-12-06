import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import TableActions from './TableActions';

afterEach(cleanup);

describe('TableActions', () => {
	test('Should handle undelegate event', async () => {
		const event = {
			unDelegateFunc: () => {},
		};
		const spy = jest.spyOn(event, 'unDelegateFunc');
		const { container } = render(<TableActions validator="0x123" unDelegateFunc={event.unDelegateFunc} />);
		await fireEvent.click(container.querySelector('.cd_tbl_action_undelegate'));
		expect(spy).toHaveBeenCalled();
	});

	test('Should disable undelegate button', async () => {
		const event = {
			unDelegateFunc: () => {},
		};
		const { container } = render(
			<TableActions validator="0x123" unDelegateFunc={event.unDelegateFunc} disableAction={true} />,
		);
		await fireEvent.click(container.querySelector('.cd_tbl_action_undelegate'));
		expect(container.querySelector('.disabled')).not.toBeNull();
	});
});
