import React from 'react';
import nftHeaderImage from '@cd/assets/image/nft-header.png';

export const NFTCard = ({ nftDetails, onNFTClick }) => {
	const { image, nftName, nftContractName } = nftDetails;
	return (
		<div className="cd_we_nft_card" onClick={() => onNFTClick(nftDetails)}>
			<div className="cd_we_ndt_card_img">
				<img
					src={image}
					alt={nftName}
					onError={(e) => {
						e.target.error = null;
						e.target.src = nftHeaderImage;
					}}
				/>
			</div>
			<div className="cd_we_nft_name" title={nftName}>
				{nftName}
			</div>
			<div className="cd_we_nft_collectible">{nftContractName}</div>
		</div>
	);
};
