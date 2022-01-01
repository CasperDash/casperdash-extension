import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import { NFTGrid } from './NFTGrid';
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
				<NFTGrid NFTInfo={NFTInfo} />
			</div>
		</section>
	);
};

export default NFTs;
