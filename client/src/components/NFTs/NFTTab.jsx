import React from 'react';
import { Nav } from 'react-bootstrap';

export const NFTTab = ({ activeTab = '/NFTs' }) => {
	return (
		<Nav variant="tabs" defaultActiveKey={activeTab}>
			<Nav.Item>
				<Nav.Link href="/NFTs">Your NFTs</Nav.Link>
			</Nav.Item>
			<Nav.Item>
				<Nav.Link href="/createNFT">Mint NFT</Nav.Link>
			</Nav.Item>
		</Nav>
	);
};
