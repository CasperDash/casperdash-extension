/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import { Modal, Button, FormControl, Form } from 'react-bootstrap';
import nftEmpty from '@cd/assets/image/nft-empty.png';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { getExplorer } from '@cd/selectors/settings';
import { ImagePreview } from '../../Common/Image/ImagePreview';
import { getTransferDeploy } from '../../../services/nftServices';
import { useConfirmDeploy } from '../../hooks/useConfirmDeploy';
import { updateNFTLocalStorage } from '../../../actions/NFTActions';
import { validateNftTransferForm } from '../../../helpers/validator';

export const NFTModal = ({
	show,
	handleClose,
	nftDetails,
	onMint,
	isMinting,
	publicKey,
	nftDeployHistory,
	enableTransferForm,
}) => {
	const { metadata, image: imageValue, nftName: name, tokenId, contractAddress, symbol } = nftDetails;
	const { executeDeploy, isDeploying: isTransferring } = useConfirmDeploy();
	const dispatch = useDispatch();

	// Selector
	const explorerUrl = useSelector(getExplorer);

	const [pendingTransfer, setPendingTransfer] = useState(false);

	useEffect(() => {
		if (!show) {
			return;
		}

		const foundDeploy = nftDeployHistory?.find(
			(deploy) => deploy.tokenId === tokenId && deploy.status === 'pending' && deploy.type === 'Transfer',
		);
		setPendingTransfer(foundDeploy);
	}, [show, tokenId, nftDeployHistory]);

	const onClose = () => {
		if (isMinting || isTransferring) {
			return;
		} else {
			handleClose();
		}
	};

	const handleSubmit = async ({ toAddress }) => {
		const buildTransferDeploy = () => {
			return getTransferDeploy({
				publicKey,
				nftContract: contractAddress,
				tokenId,
				recipient: toAddress,
			});
		};

		const { deployHash } = await executeDeploy(buildTransferDeploy, publicKey, toAddress);
		if (deployHash) {
			dispatch(
				updateNFTLocalStorage(
					publicKey,
					'nfts.deploys.transfer',
					{
						hash: deployHash,
						status: 'pending',
						timestamp: new Date().toString(),
						collectionName: symbol,
						recipient: toAddress,
						tokenId: tokenId,
					},
					'push',
				),
			);
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
				{enableTransferForm && (
					<div className="cd_nft_modal_row cd_nft_mint">
						{!pendingTransfer ? (
							<Formik
								onSubmit={handleSubmit}
								initialValues={{ toAddress: '' }}
								validate={validateNftTransferForm}
							>
								{({ values, errors, handleSubmit, handleChange }) => (
									<Form noValidate onSubmit={handleSubmit} className="cd_nft_mint_form transfer_from">
										<div className="cd_nft_transfer_recipient">
											<h3>Recipient</h3>
											<FormControl
												placeholder="Insert address"
												name="toAddress"
												value={values.toAddress}
												onChange={handleChange}
												isInvalid={errors.toAddress}
											/>
											<Form.Control.Feedback type="invalid">
												{errors.toAddress}
											</Form.Control.Feedback>
										</div>
										<div className="cd_send_currency_btn_text">
											<Button
												type="submit"
												onClick={handleSubmit}
												className="cd_send_currency_btn"
												disabled={Object.keys(errors).length || isTransferring}
											>
												{isTransferring ? 'Transferring...' : 'Transfer'}
											</Button>
										</div>
									</Form>
								)}
							</Formik>
						) : (
							<div className="cd_error_text">
								This NFT is having the pending transfer.{' '}
								<a
									target="_blank"
									rel="noreferrer"
									href={`${explorerUrl}/deploy/${pendingTransfer.hash}`}
								>
									See more details.
								</a>
							</div>
						)}
					</div>
				)}
			</Modal.Body>

			<Modal.Footer className="cd_edit_modal_footer">
				<div />
				<div>
					{typeof onMint === 'function' ? (
						<Button onClick={onMint} disabled={isMinting}>
							{isMinting ? 'Minting...' : 'Mint'}
						</Button>
					) : (
						<Button onClick={handleClose} variant="secondary">
							Close
						</Button>
					)}
				</div>
			</Modal.Footer>
		</Modal>
	);
};
