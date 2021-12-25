/* eslint-disable complexity */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import nftEmpty from 'assets/image/nft-empty.png';
import { ImagePreview } from '../../Common/Image/ImagePreview';

export const NFTModal = ({ show, handleClose, metadata = [], onMint, deployError, deployHash, isMinting }) => {
	const { value: imageValue = nftEmpty } = (metadata && metadata.find((data) => data.key === 'image')) || {};

	const name = metadata && metadata.find((data) => data.key === 'name');
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
				<Modal.Title>{name ? name.value : 'NFT'}</Modal.Title>
			</Modal.Header>

			<Modal.Body className="cd_nft_modal_body">
				<div className="cd_nft_modal_row">
					{typeof imageValue === 'string' ? (
						<div className="cd_nft_image">
							<img src={imageValue} alt="nft-detail" />
						</div>
					) : (
						<ImagePreview file={imageValue} />
					)}
					<div className="cd_nft_modal_metadata">
						{metadata &&
							metadata
								.filter((data) => data.key !== 'image' && data.key !== 'name')
								.map((meta) => (
									<div key={meta.key} className="cd_nft_metadata_row">
										<div className="cd_nft_metadata_name column">{meta.name}:</div>
										<div className="cd_nft_metadata_value column">{meta.value}</div>
									</div>
								))}
					</div>
				</div>
			</Modal.Body>

			<Modal.Footer className="cd_edit_modal_footer">
				<div className="cd_edit_modal_info">
					{deployError && !deployHash && <span className="cd_edit_modal_error">{deployError}</span>}
					{deployHash && <span className="cd_edit_modal_success">{deployHash}</span>}
				</div>
				<div>
					{typeof onMint === 'function' && !deployHash ? (
						<Button onClick={onMint} disabled={isMinting}>
							{isMinting ? 'Minting...' : 'Mint'}
						</Button>
					) : (
						<Button variant="secondary" onClick={onClose}>
							Close
						</Button>
					)}
				</div>
			</Modal.Footer>
		</Modal>
	);
};
