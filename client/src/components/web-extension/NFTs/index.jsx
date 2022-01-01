import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CasperDashNFTEmpty from 'assets/image/cd-nft-empty.png';
import nftHeaderImage from 'assets/image/nft-header.png';
import SearchIcon from 'assets/image/search-icon.svg';
import { getOwnNFTContractHash } from '../../../selectors/NFTs';
import { getNFTInfo } from '../../../selectors/NFTs';
import { getPublicKey } from '../../../selectors/user';
import { useAutoRefreshEffect } from '../../hooks/useAutoRefreshEffect';
import {
	fetchNFTInfo,
	fetchNFTContractInfo,
	addCustomNFTAddressToLocalStorage,
	getNFTAddressesFromLocalStorage,
} from '../../../actions/NFTActions';
import { Sort } from './Sort';
import './index.scss';

const NFTs = () => {
	// Hook
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// State
	const [sortObj, setSortObj] = useState({ order: 'asc', attr: 'name' });

	// Selector
	const publicKey = useSelector(getPublicKey);
	const NFTInfo = useSelector(getNFTInfo(sortObj));
	const ownNFTContracts = useSelector(getOwnNFTContractHash);

	// Effect
	useAutoRefreshEffect(() => {
		dispatch(fetchNFTInfo(publicKey, ownNFTContracts));
	}, [dispatch, publicKey, JSON.stringify(ownNFTContracts)]);

	useEffect(() => {
		if (publicKey) {
			dispatch(getNFTAddressesFromLocalStorage(publicKey));
		}
	}, [publicKey, dispatch]);

	// Function
	const onSortClick = (attribute) => {
		const sortBy = (sortObj.attr === attribute && sortObj.order) || 'asc';
		const updatedSortBy = sortBy === 'asc' ? 'desc' : 'asc';
		setSortObj({ attr: attribute, order: updatedSortBy });
	};

	return (
		<section className="cd_we_nft_page with_bottom_bar">
			<div className="cd_we_nft_filter">
				<div className="cd_we_nft_search">
					<SearchIcon />
					<input placeholder="Enter name" />
				</div>
				<Sort sortObj={sortObj} onSortClick={onSortClick} />
			</div>
			<img className="cd_we_nft_header_image" src={nftHeaderImage} alt="nft-header" />
			<div className="cd_we_nft_main hide_scroll_bar">
				<div className="cd_we_nft_count">{(NFTInfo && NFTInfo.length) || 0} NFTs</div>
				{NFTInfo && NFTInfo.length ? (
					<div className="cd_we_nft_grid ">
						{NFTInfo.map((nft, index) => {
							const image = nft.metadata.find((meta) => meta.key === 'image');
							const tokenName = nft.metadata.find((meta) => meta.key === 'name');
							return (
								<div key={index} className="cd_we_nft_card">
									<div className="cd_we_ndt_card_img">
										<img
											src={image.value}
											alt={tokenName}
											onError={(e) => {
												e.target.error = null;
												e.target.src = nftHeaderImage;
											}}
										/>
									</div>
									<div className="cd_we_nft_name">{tokenName.value}</div>
									<div className="cd_we_nft_collectible">{nft.name}</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="cd_we_nft_empty">
						<img src={CasperDashNFTEmpty} alt="empty-nft" />
						<div className="cd_we_no_nft_message">You do not have any NFT collectables yet</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default NFTs;
