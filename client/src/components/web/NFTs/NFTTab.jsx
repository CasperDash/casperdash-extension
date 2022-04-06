import React from 'react';
import { Link } from 'react-router-dom';

export const NFTTab = ({ activeTab = '/NFTs' }) => {
	return (
		<div className="cd_tabs">
			<div className="cd_tab">
				<Link to="/NFTs" className={`${activeTab === '/NFTs' ? 'active' : ''}`}>
					Your NFTs
				</Link>
			</div>
			<div className="cd_tab">
				<Link to="/createNFT" className={`${activeTab === '/createNFT' ? 'active' : ''}`}>
					Mint NFT
				</Link>
			</div>
			<div className="cd_tab">
				<Link to="/transferNFT" className={`${activeTab === '/transferNFT' ? 'active' : ''}`}>
					Transfer NFT
				</Link>
			</div>
		</div>
	);
};
