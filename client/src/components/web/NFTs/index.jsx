import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import nftEmpty from 'assets/image/nft-empty.png';
import HeadingModule from '../../Common/Layout/HeadingComponent/Heading';
import { useAutoRefreshEffect } from '../../hooks/useAutoRefreshEffect';
import { getPublicKey } from '../../../selectors/user';
import { getNFTDeployHistory, getOwnNFTContractHash } from '../../../selectors/NFTs';
import { getNFTInfo } from '../../../selectors/NFTs';
import {
	fetchNFTInfo,
	fetchNFTContractInfo,
	addCustomNFTAddressToLocalStorage,
	getNFTAddressesFromLocalStorage,
	getNFTDeploysFromLocalStorage,
} from '../../../actions/NFTActions';
import { MessageModal } from '../../Common/Layout/Modal/MessageModal';
import { AddTokenModal } from '../../Common/Layout/Modal/AddTokenModal';
import { NFTModal } from './NFTModal';
import { NFTTab } from './NFTTab';
import { NFTCard } from './NFTCard';

const NFTs = () => {
	const dispatch = useDispatch();

	// Selector
	const publicKey = useSelector(getPublicKey);
	const NFTInfo = useSelector(getNFTInfo());
	const ownNFTContracts = useSelector(getOwnNFTContractHash);
	const nftDeployHistory = useSelector(getNFTDeployHistory);

	// State
	const [showModal, setShowModal] = useState(false);
	const [selectedNFT, setSelectedNFT] = useState(false);
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
			dispatch(getNFTDeploysFromLocalStorage(publicKey));
		}
	}, [publicKey, dispatch]);

	// Functions
	const onCloseModal = () => {
		setShowModal(false);
		setSelectedNFT({});
	};

	const onOpenModal = (nftDetails) => {
		setShowModal(true);
		setSelectedNFT(nftDetails);
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
		const response = await dispatch(fetchNFTContractInfo(tokenAddress));
		const { error, data } = response;
		if (error) {
			console.error(error);
			setAddTokenError('Can not find NFT info');
		} else {
			data && data.name && dispatch(addCustomNFTAddressToLocalStorage(tokenAddress, publicKey));
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
						NFTInfo.map((nft, index) => {
							return <NFTCard key={index} nftDetails={nft} onOpenModal={onOpenModal} />;
						})
					) : (
						<div className="cd_nft_empty">
							<img src={nftEmpty} alt="no-nft-image" />
							<div className="cd_no_nft_message">You do not have any NFT collectables yet.</div>
						</div>
					)}
				</div>

				<NFTModal
					show={showModal}
					handleClose={onCloseModal}
					nftDetails={selectedNFT}
					publicKey={publicKey}
					enableTransferForm={true}
					nftDeployHistory={nftDeployHistory}
				/>
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
