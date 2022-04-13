import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchNFTInfo,
	getNFTDeploysFromLocalStorage,
	getNFTPendingDeploysStatus,
	updateNFTDeploysStatus,
} from '../../../../actions/NFTActions';
import {
	getNFTDeployHistory,
	getNFTInfo,
	getOwnNFTContractHash,
	getPendingDeployHashes,
} from '../../../../selectors/NFTs';
import { getPublicKey } from '../../../../selectors/user';
import HeadingModule from '../../../Common/Layout/HeadingComponent/Heading';
import { useAutoRefreshEffect } from '../../../hooks/useAutoRefreshEffect';
import { NFTHistory } from '../CreateNFTs/NFTHistory';
import { NFTTab } from '../NFTTab';
import NFTTransferForm from './NFTTransferForm';

const TransferNFT = () => {
	const dispatch = useDispatch();

	// Selector
	const publicKey = useSelector(getPublicKey);
	const NFTInfo = useSelector(getNFTInfo());
	const ownNFTContracts = useSelector(getOwnNFTContractHash);
	const nftDeployHistory = useSelector(getNFTDeployHistory);
	const pendingDeployHashes = useSelector(getPendingDeployHashes);

	// Effect
	useAutoRefreshEffect(() => {
		dispatch(fetchNFTInfo(publicKey, ownNFTContracts));
	}, [dispatch, publicKey, JSON.stringify(ownNFTContracts)]);

	useAutoRefreshEffect(() => {
		if (pendingDeployHashes.length) {
			(async () => {
				const { data } = await dispatch(getNFTPendingDeploysStatus(pendingDeployHashes));
				dispatch(updateNFTDeploysStatus(publicKey, 'nfts.deploys', data));
			})();
		}
	}, [JSON.stringify(pendingDeployHashes), dispatch]);

	useEffect(() => {
		if (!publicKey) {
			return;
		}

		dispatch(getNFTDeploysFromLocalStorage(publicKey));
	}, [dispatch, publicKey]);

	return (
		<section className="cd_nft_mint">
			<HeadingModule name={'NFTs'} />
			<NFTTab activeTab="/transferNFT" />
			<NFTTransferForm publicKey={publicKey} NFTs={NFTInfo} />
			<div className="cd_transaction_list">
				<h3 className="cd_transaction_list_main_heading">Deploy</h3>
				<NFTHistory nftDeployHistory={nftDeployHistory} />
			</div>
		</section>
	);
};

export default TransferNFT;
