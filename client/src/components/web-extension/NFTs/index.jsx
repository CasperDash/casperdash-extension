import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import nftHeaderImage from '@cd/assets/image/nft-header.png';
import SearchIcon from '@cd/assets/image/search-icon.svg';
import { getOwnNFTContractHash } from '../../../selectors/NFTs';
import { getNFTInfo, NFTSelector } from '../../../selectors/NFTs';
import { getPublicKey } from '../../../selectors/user';
import { useAutoRefreshEffect } from '../../hooks/useAutoRefreshEffect';
import { fetchNFTInfo, getNFTAddressesFromLocalStorage } from '../../../actions/NFTActions';
import { Sort } from './Sort';
import { NFTGrid } from './NFTGrid';
import './index.scss';

const NFTs = () => {
	// Hook
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// State
	const [sortObj, setSortObj] = useState({ order: 'asc', attr: 'name' });
	const [search, setSearch] = useState('');

	// Selector
	const publicKey = useSelector(getPublicKey);
	const NFTsInfo = useSelector(getNFTInfo(sortObj, search));
	const { loading } = useSelector(NFTSelector);
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

	const onNFTClick = (nftDetails) => {
		navigate('/nftDetails', { state: { name: nftDetails.nftName, nftDetails } });
	};

	return (
		<section className="cd_we_nft_page with_bottom_bar">
			<div className="cd_we_nft_filter">
				<div className="cd_we_nft_search">
					<SearchIcon />
					<input placeholder="Enter name" value={search} onChange={(e) => setSearch(e.target.value)} />
				</div>
				<Sort sortObj={sortObj} onSortClick={onSortClick} />
			</div>
			<img className="cd_we_nft_header_image" src={nftHeaderImage} alt="nft-header" />
			<div className="cd_we_nft_main hide_scroll_bar">
				<NFTGrid NFTsInfo={NFTsInfo} onNFTClick={onNFTClick} isLoading={loading} />
			</div>
		</section>
	);
};

export default NFTs;
