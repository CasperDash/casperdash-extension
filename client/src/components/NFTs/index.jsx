import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'react-bootstrap';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { useAutoRefreshEffect } from '../hooks/useAutoRefreshEffect';
import { getMassagedUserDetails, getPublicKey } from '../../selectors/user';
import { getNFTAddressList, getNFTInfo } from '../../selectors/NFTs';
import { fetchNFTInfo } from '../../actions/NFTActions';
import { formatKeyByPrefix } from '../../helpers/key';
import { NFTModal } from './NFTModal';
// const NFTInfo = [
// 	{
// 		contractAddress: '6cdf5a5e23eedb6b79cfe52d16fa07cbdece9516b13dde03e6c28b288d5c3a7c',
// 		name: 'CaskCollectibleToken',
// 		symbol: 'CTT',
// 		tokenId: '2574bda9897a82b7309655f7b138b423e66a53faf7856b2b8baad90ea0c62075',
// 		metadata: [
// 			{
// 				key: 'bg',
// 				name: 'Background',
// 				value: 'orange',
// 			},
// 			{
// 				key: 'description',
// 				name: 'Description',
// 				value: 'Metacask Access Token',
// 			},
// 			{
// 				key: 'distillery',
// 				name: 'Distillery',
// 				value: 'Caol Ila',
// 			},
// 			{
// 				key: 'image',
// 				name: 'Image',
// 				value: 'https://app.metacask.com/assets/images/products/product_03.png',
// 			},
// 			{
// 				key: 'logo',
// 				name: 'Logo',
// 				value: 'gold',
// 			},
// 			{
// 				key: 'name',
// 				name: 'Name',
// 				value: 'cask-1',
// 			},
// 			{
// 				key: 'rim',
// 				name: 'Rim',
// 				value: 'brown',
// 			},
// 			{
// 				key: 'wood',
// 				name: 'wood',
// 				value: 'dark',
// 			},
// 			{
// 				key: 'year',
// 				name: 'Year',
// 				value: '2002',
// 			},
// 		],
// 		commissions: [
// 			{
// 				key: 'mcask_account',
// 				name: 'Metacask Account',
// 				value: '018d09882b9c7db8ff36ab335add1dafbd39a6269be9d5a7f7c9b7f31b045312b8',
// 			},
// 			{
// 				key: 'mcask_rate',
// 				name: 'Commission Rate',
// 				value: '0.0500',
// 			},
// 		],
// 	},
// 	{
// 		contractAddress: '6cdf5a5e23eedb6b79cfe52d16fa07cbdece9516b13dde03e6c28b288d5c3a7c',
// 		name: 'CaskCollectibleToken',
// 		symbol: 'CTT',
// 		tokenId: '2574bda9897a82b7309655f7b138b423e66a53faf7856b2b8baad90ea0c62075',
// 		metadata: [
// 			{
// 				key: 'bg',
// 				name: 'Background',
// 				value: 'orange',
// 			},
// 			{
// 				key: 'description',
// 				name: 'Description',
// 				value: 'Metacask Access Token',
// 			},
// 			{
// 				key: 'distillery',
// 				name: 'Distillery',
// 				value: 'Caol Ila',
// 			},
// 			{
// 				key: 'image',
// 				name: 'Image',
// 				value: 'https://ipfs.io/ipfs/bafybeif5khfcwsz6fibpueawwjck4wvag7d3s4mun2m5czknl5xsx2vhvm/cask-1.gif',
// 			},
// 			{
// 				key: 'logo',
// 				name: 'Logo',
// 				value: 'gold',
// 			},
// 			{
// 				key: 'name',
// 				name: 'Name',
// 				value: 'cask-1',
// 			},
// 			{
// 				key: 'rim',
// 				name: 'Rim',
// 				value: 'brown',
// 			},
// 			{
// 				key: 'wood',
// 				name: 'wood',
// 				value: 'dark',
// 			},
// 			{
// 				key: 'year',
// 				name: 'Year',
// 				value: '2002',
// 			},
// 		],
// 		commissions: [
// 			{
// 				key: 'mcask_account',
// 				name: 'Metacask Account',
// 				value: '018d09882b9c7db8ff36ab335add1dafbd39a6269be9d5a7f7c9b7f31b045312b8',
// 			},
// 			{
// 				key: 'mcask_rate',
// 				name: 'Commission Rate',
// 				value: '0.0500',
// 			},
// 		],
// 	},

// 	{
// 		contractAddress: '6cdf5a5e23eedb6b79cfe52d16fa07cbdece9516b13dde03e6c28b288d5c3a7c',
// 		name: 'CaskCollectibleToken',
// 		symbol: 'CTT',
// 		tokenId: '2574bda9897a82b7309655f7b138b423e66a53faf7856b2b8baad90ea0c62075',
// 		metadata: [
// 			{
// 				key: 'bg',
// 				name: 'Background',
// 				value: 'orange',
// 			},
// 			{
// 				key: 'description',
// 				name: 'Description',
// 				value: 'Metacask Access Token',
// 			},
// 			{
// 				key: 'distillery',
// 				name: 'Distillery',
// 				value: 'Caol Ila',
// 			},
// 			{
// 				key: 'image',
// 				name: 'Image',
// 				value: 'https://ipfs.io/ipfs/bafybeif5khfcwsz6fibpueawwjck4wvag7d3s4mun2m5czknl5xsx2vhvm/cask-1.gif',
// 			},
// 			{
// 				key: 'logo',
// 				name: 'Logo',
// 				value: 'gold',
// 			},
// 			{
// 				key: 'name',
// 				name: 'Name',
// 				value: 'cask-1',
// 			},
// 			{
// 				key: 'rim',
// 				name: 'Rim',
// 				value: 'brown',
// 			},
// 			{
// 				key: 'wood',
// 				name: 'wood',
// 				value: 'dark',
// 			},
// 			{
// 				key: 'year',
// 				name: 'Year',
// 				value: '2002',
// 			},
// 		],
// 		commissions: [
// 			{
// 				key: 'mcask_account',
// 				name: 'Metacask Account',
// 				value: '018d09882b9c7db8ff36ab335add1dafbd39a6269be9d5a7f7c9b7f31b045312b8',
// 			},
// 			{
// 				key: 'mcask_rate',
// 				name: 'Commission Rate',
// 				value: '0.0500',
// 			},
// 		],
// 	},
// ];

const NFTs = () => {
	const dispatch = useDispatch();
	// Selector
	const userDetails = useSelector(getMassagedUserDetails);
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
				<div className="cd_setting_list">
					<div className="cd_setting_list_items">
						<div className="cd_setting_items_heading_peregraph">
							<h3>Account Info</h3>
							<Table className="cd_account_info_table">
								<tbody>
									<tr>
										<td>Public Key</td>
										<td>
											<span>{publicKey}</span>
										</td>
									</tr>
									<tr>
										<td>Account Hash</td>
										<td>{formatKeyByPrefix(userDetails._accountHash)}</td>
									</tr>
								</tbody>
							</Table>
						</div>
					</div>
				</div>
				<div className="cd_nft_row row">
					{NFTInfo.map(({ tokenId, metadata, commissions, name: contractName }) => {
						const image = metadata.find((meta) => meta.key === 'image');
						const tokenName = metadata.find((meta) => meta.key === 'name');
						return (
							<div
								className="cd_nft_col col-lg-3 col-md-6"
								key={tokenId}
								onClick={() => onOpenModal(metadata)}
							>
								<div className="cd_nft_content position-relative">
									<div className="cd_nft_image">
										<img src={image ? image.value : 'assets/image/nft6.jpeg'} alt="nft-image" />
									</div>
									<div className="cd_nft_content_text">{tokenName.value}</div>
								</div>
							</div>
						);
					})}
				</div>

				<NFTModal show={showModal} handleClose={onCloseModal} metadata={selectedMetadata} />
			</section>
		</>
	);
};

export default NFTs;
