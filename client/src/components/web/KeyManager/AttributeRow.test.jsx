import React from 'react';
import * as redux from 'react-redux';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { AttributeRow } from './AttributeRow';

afterEach(cleanup);
const spyOnUseSelector = jest.spyOn(redux, 'useSelector');

test('Display all keys', () => {
	spyOnUseSelector.mockReturnValue({});
	const onEdit = jest.fn();
	const { getByText, container } = render(
		<table>
			<tbody>
				<AttributeRow label="Weight" canEdit value={1} onEdit={onEdit} />
			</tbody>
		</table>,
	);

	expect(getByText('Weight').textContent).toBe('Weight');
	const editBtn = container.querySelector('.bi-pencil-fill');
	fireEvent.click(editBtn);
	expect(onEdit).toHaveBeenCalled();
});
