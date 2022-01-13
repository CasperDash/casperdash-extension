import React from 'react';
import nftEmpty from 'assets/image/nft-empty.png';

export const NFTCard = ({ nftDetails, onOpenModal }) => {
	const { image, nftName, tokenId } = nftDetails;

	return tokenId ? (
		<div className="cd_nft_col col-lg-3 col-md-3" key={tokenId} onClick={() => onOpenModal(nftDetails)}>
			<div className="cd_nft_content position-relative">
				<div className="cd_nft_image">
					<img
						src={image}
						alt="nft-image"
						onError={(e) => {
							e.target.error = null;
							e.target.src = nftEmpty;
						}}
					/>
				</div>
				<div className="cd_nft_content_text">{nftName}</div>
			</div>
		</div>
	) : null;
};
