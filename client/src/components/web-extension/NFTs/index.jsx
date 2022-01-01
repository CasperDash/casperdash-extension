import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NFTEmptyImage from 'assets/image/nft-empty.png';
import nftHeaderImage from 'assets/image/nft-header.png';
import SearchIcon from 'assets/image/search-icon.svg';
import ArrowUpIcon from 'assets/image/arrow-up.svg';
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
import './index.scss';

const NFTs = () => {
	// Hook
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const publicKey = useSelector(getPublicKey);
	const NFTInfo = useSelector(getNFTInfo);
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

	return (
		<section className="cd_we_nft_page with_bottom_bar">
			<div className="cd_we_nft_filter">
				<div className="cd_we_nft_search">
					<SearchIcon />
					<input placeholder="Enter name" />
				</div>

				<div className="cd_we_nft_sort">
					<div className="cd_we_nft_sort_by">
						Collectible
						<ArrowUpIcon />
					</div>
					<div className="cd_we_nft_sort_by">
						Name
						<ArrowUpIcon />
					</div>
				</div>
			</div>
			<img className="cd_we_nft_header_image" src={nftHeaderImage} alt="nft-header" />
			<div className="cd_we_nft_main hide_scroll_bar">
				{/* <div className="cd_we_nft_main_content"> */}
				{NFTInfo && NFTInfo.length ? (
					<>
						<div className="cd_we_nft_count">{NFTInfo.length} NFTs</div>
						<div className="cd_we_nft_grid ">
							{NFTInfo.map((nft, index) => {
								const image = nft.metadata.find((meta) => meta.key === 'image');
								const tokenName = nft.metadata.find((meta) => meta.key === 'name');
								return (
									<div key={index} className="cd_we_nft_card">
										<div className="cd_we_ndt_card_img">
											<img src={image.value} />
										</div>
										<div className="cd_we_nft_name">{tokenName.value}</div>
										<div className="cd_we_nft_collectible">{nft.name}</div>
									</div>
								);
							})}
						</div>
					</>
				) : (
					<div className="cd_nft_empty">
						<div className="cd_no_nft_message">You do not have any NFT collectables yet.</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default NFTs;
