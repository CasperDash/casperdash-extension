import React from 'react';

export const NFTCard = ({ tokenId, metadata, onOpenModal }) => {
	const image = metadata.find((meta) => meta.key === 'image');
	const tokenName = metadata.find((meta) => meta.key === 'name');

	return tokenId ? (
		<div className="cd_nft_col col-lg-3 col-md-3" key={tokenId} onClick={() => onOpenModal(metadata)}>
			<div className="cd_nft_content position-relative">
				<div className="cd_nft_image">
					<img src={image ? image.value : 'assets/image/nft-empty.png'} alt="nft-image" />
				</div>
				<div className="cd_nft_content_text">{tokenName ? tokenName.value : 'NFT'}</div>
			</div>
		</div>
	) : null;
};
