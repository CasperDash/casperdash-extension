/* eslint-disable react/jsx-indent-props */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { NFTTab } from '../NFTTab';
import { getNFTContracts } from '../../../selectors/NFTs';
import { getPublicKey } from '../../../selectors/user';
import { fetchNTFContractInfo } from '../../../actions/NFTActions';
import HeadingModule from '../../Common/Layout/HeadingComponent/Heading';
import { NFTMintForm } from './NFTMintForm';
import { DeployConfirmModal } from './DeployConfirmModal';

const CreateNFT = () => {
	const dispatch = useDispatch();
	//Selector
	const publicKey = useSelector(getPublicKey);
	const nftContracts = useSelector(getNFTContracts);

	//State
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	//Effect
	useEffect(() => {
		if (publicKey) {
			dispatch(fetchNTFContractInfo(publicKey));
		}
	}, [dispatch, publicKey]);

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
					<Button onClick={handleDeployTextClick}>Add new collection</Button>
					<NFTMintForm publicKey={publicKey} nftContracts={nftContracts} />
				</>
			)}
			<DeployConfirmModal
				show={showConfirmModal}
				handleClose={() => setShowConfirmModal(false)}
				publicKey={publicKey}
			/>
		</section>
	);
};

export default CreateNFT;
