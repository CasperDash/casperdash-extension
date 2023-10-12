import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SendIcon from '@cd/assets/image/send-icon.svg';
import nftHeaderImage from '@cd/assets/image/nft-header.png';
import { NFTAttributes } from '../components/NFTAttributes';
import { NFTTransferForm } from '../components/NFTTransferForm';

import './NFTDetails.scss';

const TYPES = {
	DETAIL: 'DETAIL',
	TRANSFER_FORM: 'TRANSFER_FORM',
}

export const NFTDetails = () => {
	const {
		state: { nftDetails },
	} = useLocation();
	const { image, nftName, isTransfarable } = nftDetails || {};
	const [displayType, setDisplayType] = useState(TYPES.DETAIL);

	const onSendClick = () => {
		setDisplayType(TYPES.TRANSFER_FORM);
	}
	const handleOnCancel = () => {
		setDisplayType(TYPES.DETAIL);
	}

	return (
		<section className="cd_we_nft_details">
			<div className="cd_we_nft_details_image">
				<img
					src={image}
					alt={nftName}
					onError={(e) => {
						e.target.error = null;
						e.target.src = nftHeaderImage;
					}}
				/>
			</div>
			<div className="cd_we_nft_details__buttons">
				{
					displayType === TYPES.DETAIL && isTransfarable && (
						<div className="cd_we_nft_details__send">
							<div className="cd_we_nft_details__send--icon" onClick={onSendClick}>
								<SendIcon />
							</div>
						</div>
					)
				}
			</div>
			{
				displayType === TYPES.DETAIL && <NFTAttributes nftDetails={nftDetails} />
			}
			{
				displayType === TYPES.TRANSFER_FORM && <NFTTransferForm nftDetails={nftDetails} onCancel={handleOnCancel} />
			}
		</section>
	);
};
