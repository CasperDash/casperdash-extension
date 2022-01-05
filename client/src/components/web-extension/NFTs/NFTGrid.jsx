import React from 'react';
import CasperDashNFTEmpty from 'assets/image/cd-nft-empty.png';
import { NFTCard } from './NFTCard';

export const NFTGrid = ({ NFTsInfo, onNFTClick }) => {
	return (
		<>
			<div className="cd_we_nft_count">{(NFTsInfo && NFTsInfo.length) || 0} NFTs</div>
			{NFTsInfo && NFTsInfo.length ? (
				<div className="cd_we_nft_grid ">
					{NFTsInfo.map((nftDetails) => {
						return <NFTCard key={nftDetails.tokenId} nftDetails={nftDetails} onNFTClick={onNFTClick} />;
					})}
				</div>
			) : (
				<div className="cd_we_nft_empty">
					<img src={CasperDashNFTEmpty} alt="empty-nft" />
					<div className="cd_we_no_nft_message">You do not have any NFT collectables yet</div>
				</div>
			)}
		</>
	);
};
