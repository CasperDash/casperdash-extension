/* eslint-disable react/jsx-indent-props */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { NFTTab } from '../NFTTab';
import { getNFTContracts, getNFTDeployHistory, getPendingDeployHashes } from '../../../selectors/NFTs';
import { getPublicKey } from '../../../selectors/user';
import {
	fetchAllNTFContractInfoByPublicKey,
	getNFTDeploysFromLocalStorage,
	getNFTPendingDeploysStatus,
	updateNFTDeploysStatus,
} from '../../../actions/NFTActions';
import { useAutoRefreshEffect } from '../../hooks/useAutoRefreshEffect';
import HeadingModule from '../../Common/Layout/HeadingComponent/Heading';
import { NFTMintForm } from './NFTMintForm';
import { DeployConfirmModal } from './DeployConfirmModal';
import { NFTHistory } from './NFTHistory';

const CreateNFT = () => {
	const dispatch = useDispatch();
	//Selector
	const publicKey = useSelector(getPublicKey);
	const nftContracts = useSelector(getNFTContracts);
	const nftDeployHistory = useSelector(getNFTDeployHistory);
	const pendingDeployHashes = useSelector(getPendingDeployHashes);

	const history = useHistory();

	//State
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	//Effect
	useEffect(() => {
		if (!publicKey) {
			history.push('/NFTs');
		}
	}, [history, publicKey]);

	useEffect(() => {
		if (publicKey) {
			dispatch(fetchAllNTFContractInfoByPublicKey(publicKey));
			dispatch(getNFTDeploysFromLocalStorage(publicKey));
		}
	}, [dispatch, publicKey]);

	useAutoRefreshEffect(() => {
		if (pendingDeployHashes.length) {
			(async () => {
				const { data } = await dispatch(getNFTPendingDeploysStatus(pendingDeployHashes));
				dispatch(updateNFTDeploysStatus(publicKey, 'nfts.deploys', data));
			})();
		}
	}, [JSON.stringify(pendingDeployHashes), dispatch]);

	const isContractAvailable = nftContracts.length;

	const handleDeployTextClick = () => {
		setShowConfirmModal(true);
	};

	return (
		<section className="cd_nft_mint">
			<HeadingModule name={'NFTs'} />
			<NFTTab activeTab="/createNFT" />

			{!isContractAvailable && publicKey ? (
				<div className="cd_error_text">
					Your account did not have any collections yet.{' '}
					<a href="#" onClick={handleDeployTextClick}>
						Click to deploy.
					</a>
				</div>
			) : (
				<>
					<Button onClick={handleDeployTextClick} className="cd_nft_btn_add_collection">
						Add new collection
					</Button>
					<NFTMintForm publicKey={publicKey} nftContracts={nftContracts} />
				</>
			)}
			<div className="cd_transaction_list">
				<h3 className="cd_transaction_list_main_heading">Deploy</h3>
				<NFTHistory nftDeployHistory={nftDeployHistory} />
			</div>
			<DeployConfirmModal
				show={showConfirmModal}
				handleClose={() => setShowConfirmModal(false)}
				publicKey={publicKey}
			/>
		</section>
	);
};

export default CreateNFT;
