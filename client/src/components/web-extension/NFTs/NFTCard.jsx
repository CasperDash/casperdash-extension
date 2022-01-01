import React from 'react';
import nftHeaderImage from 'assets/image/nft-header.png';

export const NFTCard = ({ image, nftName, collectionName }) => {
	return (
		<div className="cd_we_nft_card">
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
			<div className="cd_we_nft_name">{nftName}</div>
			<div className="cd_we_nft_collectible">{collectionName}</div>
		</div>
	);
};
