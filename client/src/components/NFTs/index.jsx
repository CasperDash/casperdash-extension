import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { useAutoRefreshEffect } from '../hooks/useAutoRefreshEffect';
import { getPublicKey } from '../../selectors/user';
import { getOwnNFTContractHash } from '../../selectors/NFTs';
import { getNFTInfo } from '../../selectors/NFTs';
import {
	fetchNFTInfo,
	fetchNFTContractInfo,
	addCustomNFTAddressToLocalStorage,
	getNFTAddressesFromLocalStorage,
} from '../../actions/NFTActions';
import { MessageModal } from '../Common/Layout/Modal/MessageModal';
import { AddTokenModal } from '../Common/Layout/Modal/AddTokenModal';
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
	const [showAddTokenModal, setShowAddTokenModal] = useState(false);
	const [addTokenError, setAddTokenError] = useState('');
	const [showError, setShowError] = useState(false);

	// Effect
	useAutoRefreshEffect(() => {
		dispatch(fetchNFTInfo(publicKey, ownNFTContracts));
	}, [dispatch, publicKey, JSON.stringify(ownNFTContracts)]);

	useEffect(() => {
		if (publicKey) {
			dispatch(getNFTAddressesFromLocalStorage(publicKey));
		}
	}, [publicKey, dispatch]);

	// Functions
	const onCloseModal = () => {
		setShowModal(false);
		setSelectedMetadata([]);
	};

	const onOpenModal = (metadata) => {
		setShowModal(true);
		setSelectedMetadata(metadata);
	};

	const onAddNewTokenAddress = () => {
		if (!publicKey) {
			setShowError(true);
		} else {
			setShowAddTokenModal(true);
		}
	};

	const onCloseTokenModal = () => {
		setShowAddTokenModal(false);
	};

	const handleAddToken = async (tokenAddress) => {
		const { data, error } = await dispatch(fetchNFTContractInfo(tokenAddress));
		if (error) {
			setAddTokenError(error);
		} else {
			data.name && dispatch(addCustomNFTAddressToLocalStorage(tokenAddress, publicKey));
			setShowAddTokenModal(false);
		}
	};

	return (
		<>
			<section className="cd_wallets_page">
				<HeadingModule name={'NFTs'} />
				{publicKey && <NFTTab activeTab="/NFTs" />}

				<div className="cd_add_token_content cd_add_token_row row">
					<div className="cd_add_token_column cd_add_token_btn_col col" onClick={onAddNewTokenAddress}>
						<div className="cd_add_token_btn_content">+ Add NFT Contract</div>
					</div>
				</div>
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
				<AddTokenModal
					show={showAddTokenModal}
					handleClose={onCloseTokenModal}
					handleAddToken={handleAddToken}
					error={addTokenError}
				/>
				<MessageModal
					type="Error"
					message="Unlock your Signer!"
					show={showError}
					handleClose={() => setShowError(false)}
				/>
			</section>
		</>
	);
};

export default NFTs;
