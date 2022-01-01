import React from 'react';
import { useNavigate } from 'react-router-dom';
import NFTEmptyImage from 'assets/image/nft-empty.png';
import nftHeaderImage from 'assets/image/nft-header.png';
import SearchIcon from 'assets/image/search-icon.svg';
import ArrowUpIcon from 'assets/image/arrow-up.svg';
import './index.scss';

const NFTs = () => {
	// Hook
	const navigate = useNavigate();

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
				<div className="cd_we_nft_count">236 NFTs</div>
				<div className="cd_we_nft_grid ">
					{new Array(10).fill().map((v, i) => (
						<div key={i} className="cd_we_nft_card">
							<div className="cd_we_ndt_card_img">
								<img src={NFTEmptyImage} />
							</div>
							<div className="cd_we_nft_name">Name1</div>
							<div className="cd_we_nft_collectible">Collectible</div>
						</div>
					))}
				</div>
				{/* </div> */}
			</div>
		</section>
	);
};

export default NFTs;
