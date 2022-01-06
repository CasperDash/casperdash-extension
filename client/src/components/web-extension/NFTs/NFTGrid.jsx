import React from 'react';
import NoData from '../../Common/NoData';
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
				<NoData message="You do not have any NFT collectables yet" />
			)}
		</>
	);
};
