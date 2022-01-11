import React from 'react';
import { render } from '@testing-library/react';
import BottomBar from './BottomBar';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	Link: ({ className }) => <div className={className} />,
}));

test('Should show menu on bottom bar', () => {
	const { getByTitle, container } = render(
		<BottomBar
			modules={[{ name: 'nft', route: '/nft' }, { name: 'market' }]}
			currentModule={{ name: 'nft', route: '/nft' }}
		/>,
	);
	expect(getByTitle('nft').title).toBe('nft');
	expect(getByTitle('market').title).toBe('market');
	expect(Boolean(container.querySelector('.active'))).toBe(true);
});
