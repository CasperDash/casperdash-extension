import React from 'react';
import NoData from '../../Common/NoData';
import { Bar } from '../../Common/Spinner';
import { NFTCard } from './NFTCard';

export const NFTGrid = ({ NFTsInfo = [], onNFTClick, isLoading }) => {
	return (
		<>
			<div className="cd_we_nft_count">{NFTsInfo.length} NFTs</div>

			{NFTsInfo.length ? (
				<div className="cd_we_nft_grid ">
					{NFTsInfo.map((nftDetails) => {
						return <NFTCard key={nftDetails.tokenId} nftDetails={nftDetails} onNFTClick={onNFTClick} />;
					})}
				</div>
			) : null}
			{!isLoading && !NFTsInfo.length && <NoData message="You do not have any NFT collectables yet" />}

			{isLoading && <Bar />}
		</>
	);
};
