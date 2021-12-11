/* eslint-disable react/jsx-indent-props */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NFTTab } from '../NFTTab';
import { getNFTContracts } from '../../../selectors/NFTs';
import { getPublicKey } from '../../../selectors/user';
import { fetchNTFContractInfo } from '../../../actions/NFTActions';
import HeadingModule from '../../Common/Layout/HeadingComponent/Heading';
import { NFTMintForm } from './NFTMintForm';

const CreateNFT = () => {
	const dispatch = useDispatch();
	//Selector
	const publicKey = useSelector(getPublicKey);
	const nftContracts = useSelector(getNFTContracts);
	//Effect
	useEffect(() => {
		if (publicKey) {
			dispatch(fetchNTFContractInfo(publicKey));
		}
	}, [dispatch, publicKey]);

	const isContractAvailable = nftContracts.length;

	return (
		<section className="cd_nft_mint">
			<HeadingModule name={'NFTs'} />
			<NFTTab activeTab="/createNFT" />

			{!isContractAvailable && publicKey ? (
				<div className="cd_error_text">
					Your account have not deployed keys manager contract yet. <a href="#">Click to deploy.</a>
				</div>
			) : (
				<NFTMintForm publicKey={publicKey} nftContracts={nftContracts} />
			)}
		</section>
	);
};

export default CreateNFT;
