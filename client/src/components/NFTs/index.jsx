import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { useAutoRefreshEffect } from '../hooks/useAutoRefreshEffect';
import { getPublicKey } from '../../selectors/user';
import { getNFTAddressList, getNFTInfo } from '../../selectors/NFTs';
import { fetchNFTInfo } from '../../actions/NFTActions';
import { NFTModal } from './NFTModal';

const NFTs = () => {
	const dispatch = useDispatch();

	// Selector
	const publicKey = useSelector(getPublicKey);
	const NFTAddressList = useSelector(getNFTAddressList);
	const NFTInfo = useSelector(getNFTInfo);

	// State
	const [showModal, setShowModal] = useState(false);
	const [selectedMetadata, setSelectedMetadata] = useState(false);

	// Effect
	useAutoRefreshEffect(() => {
		dispatch(fetchNFTInfo(NFTAddressList, publicKey));
	}, [dispatch, JSON.stringify(NFTAddressList)]);

	// Functions
	const onCloseModal = () => {
		setShowModal(false);
	};

	const onOpenModal = (metadata) => {
		setShowModal(true);
		setSelectedMetadata(metadata);
	};

	return (
		<>
			<section className="cd_wallets_page">
				<HeadingModule name={'NFTs'} />

				<div className="cd_nft_row row">
					{NFTInfo.length ? (
						NFTInfo.map(({ tokenId, metadata = [] }) => {
							const image = metadata.find((meta) => meta.key === 'image');
							const tokenName = metadata.find((meta) => meta.key === 'name');
							return tokenId ? (
								<div
									className="cd_nft_col col-lg-2 col-md-3"
									key={tokenId}
									onClick={() => onOpenModal(metadata)}
								>
									<div className="cd_nft_content position-relative">
										<div className="cd_nft_image">
											<img src={image ? image.value : 'assets/image/nft-empty.png'} />
										</div>
										<div className="cd_nft_content_text">{tokenName ? tokenName.value : 'NFT'}</div>
									</div>
								</div>
							) : null;
						})
					) : (
						<div className="cd_nft_empty">
							<img src="assets/image/nft-empty.png" alt="nft-image" />
							<div className="cd_no_nft_message">You do not have any NFT collectables yet.</div>
						</div>
					)}
				</div>

				<NFTModal show={showModal} handleClose={onCloseModal} metadata={selectedMetadata} />
			</section>
		</>
	);
};

export default NFTs;
