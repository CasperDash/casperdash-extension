import React from 'react';
import { render } from '@testing-library/react';
import { ImagePreview } from './ImagePreview';

test('Should not load file', () => {
	const readAsDataURL = jest.spyOn(FileReader.prototype, 'readAsDataURL');

	render(<ImagePreview />);
	expect(readAsDataURL).toHaveBeenCalledTimes(0);
});

test('Should Loading status', () => {
	const readAsDataURL = jest.spyOn(FileReader.prototype, 'readAsDataURL');

	const blob = new Blob();
	const { getByText } = render(<ImagePreview file={blob} />);
	expect(readAsDataURL).toBeCalledWith(blob);
	expect(getByText('Loading').textContent).toBe('Loading');
});
