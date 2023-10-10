import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import HistoryIcon from '@cd/assets/image/ic-history.svg';
import { NFTSelector } from '@cd/selectors/NFTs';
import Bar from '@cd/components/Common/Spinner/Bar';
import NoData from '@cd/components/Common/NoData';
import { NFTCard } from '../NFTCard';
import { NFTHistories } from '../NFTHistories';

const DISPLAY_TYPES = {
	GRID: 'GRID',
	HISTORIES: 'HISTORIES',
};

export const NFTGrid = ({ NFTsInfo = [], onNFTClick }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const displayType = searchParams.get('displayType') || DISPLAY_TYPES.GRID;
	const { loading: isLoading } = useSelector(NFTSelector);
	const handleOnClick = (type) => {
		searchParams.set('displayType', type);
		setSearchParams(searchParams);
	}

	return (
		<>
			<div className="cd_we_nft_header">
				<div className={
					clsx('cd_we_nft_count', {
					'active': displayType === DISPLAY_TYPES.GRID,
					})
				}
					onClick={() => handleOnClick(DISPLAY_TYPES.GRID)}
				>{NFTsInfo.length} NFTs</div>
				<HistoryIcon className={
					clsx(
						'cd_we_nft_histories_icon',
						{
							'active': displayType === DISPLAY_TYPES.HISTORIES,
						},
					)
				}
					onClick={() => handleOnClick(DISPLAY_TYPES.HISTORIES)}
				/>
			</div>

			{
				displayType === DISPLAY_TYPES.GRID && 
					(
						<>
							{
								NFTsInfo.length > 0 && (
									<div className="cd_we_nft_grid ">
										{NFTsInfo.map((nftDetails) => {
											return <NFTCard key={nftDetails.tokenId} nftDetails={nftDetails} onNFTClick={onNFTClick} />;
										})}
									</div>
								)
							}
							{!isLoading && !NFTsInfo.length && <NoData message="You do not have any NFT collectables yet" />}
							{isLoading && <Bar />}
						</>
					)
			}

			{
				displayType === DISPLAY_TYPES.HISTORIES &&
					(
						<NFTHistories />
					)
			}
		</>
	);
};
