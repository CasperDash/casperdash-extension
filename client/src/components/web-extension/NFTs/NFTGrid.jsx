import React from 'react';
import CasperDashNFTEmpty from 'assets/image/cd-nft-empty.png';
import { NFTCard } from './NFTCard';

export const NFTGrid = ({ NFTInfo }) => {
	return (
		<>
			<div className="cd_we_nft_count">{(NFTInfo && NFTInfo.length) || 0} NFTs</div>
			{NFTInfo && NFTInfo.length ? (
				<div className="cd_we_nft_grid ">
					{NFTInfo.map(({ tokenId, image, nftName, nftContractName }) => {
						return (
							<NFTCard key={tokenId} image={image} nftName={nftName} collectionName={nftContractName} />
						);
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
