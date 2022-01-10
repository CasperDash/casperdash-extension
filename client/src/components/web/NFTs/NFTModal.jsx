/* eslint-disable complexity */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import nftEmpty from 'assets/image/nft-empty.png';
import { ImagePreview } from '../../Common/Image/ImagePreview';

export const NFTModal = ({ show, handleClose, nftDetails, onMint, isMinting }) => {
	const { metadata, image: imageValue, nftName: name } = nftDetails;

	const onClose = () => {
		if (isMinting) {
			return;
		} else {
			handleClose();
		}
	};
	return (
		<Modal show={show} onHide={onClose} centered className="cd_edit_modal_content" size="lg">
			<Modal.Header closeButton className="cd_edit_modal_header">
				<Modal.Title>{name || 'NFT'}</Modal.Title>
			</Modal.Header>

			<Modal.Body className="cd_nft_modal_body">
				<div className="cd_nft_modal_row">
					{typeof imageValue === 'string' ? (
						<div className="cd_nft_image">
							<img
								src={imageValue}
								alt="nft-detail"
								onError={(e) => {
									e.target.error = null;
									e.target.src = nftEmpty;
								}}
							/>
						</div>
					) : (
						<ImagePreview file={imageValue} />
					)}
					<div className="cd_nft_modal_metadata">
						{metadata &&
							metadata.map((meta) => (
								<div key={meta.key} className="cd_nft_metadata_row">
									<div className="cd_nft_metadata_name column">{meta.name}:</div>
									<div className="cd_nft_metadata_value column">{meta.value}</div>
								</div>
							))}
					</div>
				</div>
			</Modal.Body>

			<Modal.Footer className="cd_edit_modal_footer">
				<div />
				<div>
					<Button onClick={onMint} disabled={isMinting}>
						{isMinting ? 'Minting...' : 'Mint'}
					</Button>
				</div>
			</Modal.Footer>
		</Modal>
	);
};
