import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { useAutoRefreshEffect } from '../hooks/useAutoRefreshEffect';
import { getPublicKey } from '../../selectors/user';
import { getOwnNFTContractHash } from '../../selectors/NFTs';
import { getNFTInfo } from '../../selectors/NFTs';
import { fetchNFTInfo } from '../../actions/NFTActions';
import { NFTModal } from './NFTModal';
import { NFTTab } from './NFTTab';

const NFTs = () => {
	const dispatch = useDispatch();

	// Selector
	const publicKey = useSelector(getPublicKey);
	const NFTInfo = useSelector(getNFTInfo);
	const ownNFTContracts = useSelector(getOwnNFTContractHash);
	// State
	const [showModal, setShowModal] = useState(false);
	const [selectedMetadata, setSelectedMetadata] = useState(false);

	// Effect
	useAutoRefreshEffect(() => {
		dispatch(fetchNFTInfo(publicKey, ownNFTContracts));
	}, [dispatch, publicKey, JSON.stringify(ownNFTContracts)]);

	// Functions
	const onCloseModal = () => {
		setShowModal(false);
		setSelectedMetadata([]);
	};

	const onOpenModal = (metadata) => {
		setShowModal(true);
		setSelectedMetadata(metadata);
	};

	return (
		<>
			<section className="cd_wallets_page">
				<HeadingModule name={'NFTs'} />
				{publicKey && <NFTTab activeTab="/NFTs" />}

				<div className="cd_nft_row row">
					{NFTInfo && NFTInfo.length ? (
						NFTInfo.map(({ tokenId, metadata = [] }) => {
							const image = metadata.find((meta) => meta.key === 'image');
							const tokenName = metadata.find((meta) => meta.key === 'name');
							return tokenId ? (
								<div
									className="cd_nft_col col-lg-3 col-md-3"
									key={tokenId}
									onClick={() => onOpenModal(metadata)}
								>
									<div className="cd_nft_content position-relative">
										<div className="cd_nft_image">
											<img
												src={image ? image.value : 'assets/image/nft-empty.png'}
												alt="nft-image"
											/>
										</div>
										<div className="cd_nft_content_text">{tokenName ? tokenName.value : 'NFT'}</div>
									</div>
								</div>
							) : null;
						})
					) : (
						<div className="cd_nft_empty">
							<img src="assets/image/nft-empty.png" alt="no-nft-image" />
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
