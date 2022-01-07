/* eslint-disable complexity */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, FormControl } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import { toast } from 'react-toastify';
import { putDeploy } from '../../../../actions/deployActions';
import { storeFile, deleteFile } from '../../../../actions/fileActions';
import { updateNFTLocalStorage } from '../../../../actions/NFTActions';
import { getSingedMintDeploy } from '../../../../services/nftServices';
import { ImagePreview } from '../../../Common/Image/ImagePreview';
import { NFT_GATEWAY } from '../../../../constants/key';
import { validateNFTMintForm } from '../../../../helpers/validator';
import { massageNFTMintFormValues } from '../../../../helpers/nft';
import { MAX_METADATA_ATTRIBUTES } from '../../../../constants/nft';
import useSigner from '../../../hooks/useSigner';
import { NFTModal } from '../NFTModal';
import SelectField from './SelectField';
import { NFTAttributeRow } from './NFTAttributeRow';

const mintFee = { key: 'fee', name: 'Fee', value: '1 CSPR' };

export const NFTMintForm = ({ publicKey, nftContracts }) => {
	const dispatch = useDispatch();
	const signer = useSigner();

	// State
	const [attributes, setAttributes] = useState([{ attribute0: '', value0: '' }]);
	const [showNFTModal, setShowNFTModal] = useState(false);
	const [nftInfo, setNFTInfo] = useState({});
	const [previewNFT, setPreviewNFT] = useState({});
	const [deployHash, setDeployHash] = useState();
	const [isMinting, setIsMinting] = useState(false);

	// function
	const onMintNFT = async () => {
		setIsMinting(true);
		let imageCID;
		try {
			// store file by nft.storage
			const { data: cid } = await dispatch(storeFile(nftInfo.image));
			if (!cid || !cid.cid) {
				throw new Error('Can not store image');
			}
			imageCID = cid.cid;
			// Update name and image and massage metadata
			const updatedNFT = {
				...nftInfo,
				metadata: [
					...nftInfo.metadata,
					{ key: 'image', value: `https://${imageCID}.${NFT_GATEWAY}`, name: 'image' },
					{ key: 'name', value: nftInfo.nftName, name: 'name' },
				].map((attr) => [attr.name, attr.value]),
			};

			// Build and request to sign deploy with signer
			const deploy = await getSingedMintDeploy({ ...updatedNFT, publicKey });
			const signedDeploy = await signer.sign(deploy, publicKey, nftInfo.recipient);

			const { data: hash, error } = await dispatch(putDeploy(signedDeploy));
			if (error) {
				console.error(error);
				throw Error('Error on mint NFT.');
			}
			setDeployHash(hash.deployHash);

			const selectedContract = nftContracts.find((ct) => ct.value === nftInfo.nftContract) || {};
			dispatch(
				updateNFTLocalStorage(
					publicKey,
					`nfts.deploys.mint`,
					{
						hash: hash.deployHash,
						status: 'pending',
						timestamp: new Date().toString(),
						collectionName: selectedContract.symbol || '',
						recipient: nftInfo.recipient || '',
					},
					'push',
				),
			);
		} catch (error) {
			if (imageCID) {
				dispatch(deleteFile(imageCID));
			}
			console.error(error);
			toast.error(error.message);
		}

		setIsMinting(false);
	};

	const handleSubmit = async (values) => {
		const nftInfo = massageNFTMintFormValues(values);
		setPreviewNFT(nftInfo);
		setNFTInfo(nftInfo);
		setShowNFTModal(true);
	};

	const onAddNewAttribute = () => {
		if (attributes.length >= MAX_METADATA_ATTRIBUTES) {
			return;
		}
		const newAttribute = { [`attribute${attributes.length}`]: '', [`value${attributes.length}`]: '' };
		setAttributes([...attributes, newAttribute]);
	};

	const onRemoveAttribute = (index) => {
		if (attributes.length == 1) {
			return;
		}
		let updatedAttributes = [...attributes];
		updatedAttributes.splice(index, 1);
		setAttributes(updatedAttributes);
	};

	const clearConfirmState = () => {
		setDeployHash('');
		setPreviewNFT({});
		setNFTInfo({});
	};

	return (
		<>
			<Formik onSubmit={handleSubmit} initialValues={{ toAddress: '', name: '' }} validate={validateNFTMintForm}>
				{({ values, errors, handleSubmit, handleChange, setFieldValue, resetForm }) => (
					<Form noValidate onSubmit={handleSubmit} className="cd_nft_mint_form">
						<div className="cd_nft_mint_contract">
							<h3>NFT Contract</h3>
							<Form.Group className="mb-3" controlId="cd_nft_mint_contract_dropdown">
								<Field name={'nftContract'} component={SelectField} options={nftContracts} />
							</Form.Group>
							<Form.Control.Feedback type="invalid">{errors.nftContract}</Form.Control.Feedback>
						</div>
						<div className="cd_nft_mint_recipient">
							<h3>
								Recipient <span className="cd_field_note">( Leave it empty to mint for yourself )</span>
							</h3>
							<FormControl
								placeholder="Insert address"
								name="toAddress"
								value={values.toAddress}
								onChange={handleChange}
								isInvalid={errors.toAddress}
							/>
							<Form.Control.Feedback type="invalid">{errors.toAddress}</Form.Control.Feedback>
						</div>
						<div className="cd_nft_mint_metadata">
							<h3>Metadata</h3>
							<div className="cd_nft_mint_name">
								<h4>
									Name <span className="cd_field_note">*</span>
								</h4>
								<FormControl
									placeholder="NFT name"
									name="name"
									value={values.name}
									onChange={handleChange}
									isInvalid={errors.name}
								/>
								<Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
							</div>

							<div className="cd_nft_mint_image">
								<h4>
									Image File <span className="cd_field_note">*</span>
								</h4>
								<ImagePreview file={values.image} />
								<FormControl
									placeholder="Image file"
									name="image"
									onChange={(e) => {
										setFieldValue('image', e.currentTarget.files[0]);
									}}
									isInvalid={errors.image}
									type="file"
								/>
								<Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
							</div>

							<div className="cd_nft_mint_attributes">
								<h4>
									Attributes <i className="bi bi-plus-circle-fill" onClick={onAddNewAttribute} />
								</h4>
								{attributes.map((value, index) => {
									return (
										<NFTAttributeRow
											key={index}
											values={values}
											errors={errors}
											index={index}
											handleChange={handleChange}
											onRemoveAttribute={onRemoveAttribute}
										/>
									);
								})}
							</div>
						</div>
						<div className="cd_send_currency_btn_text">
							<Button onClick={resetForm} className="cd_send_currency_btn">
								Clear
							</Button>
							<Button
								type="submit"
								onClick={handleSubmit}
								className="cd_send_currency_btn"
								disabled={Object.keys(errors).length}
							>
								Mint
							</Button>
						</div>
					</Form>
				)}
			</Formik>
			<NFTModal
				show={showNFTModal}
				nftDetails={{
					...previewNFT,
					metadata: previewNFT.metadata ? [...previewNFT.metadata, mintFee] : [mintFee],
				}}
				handleClose={() => {
					setShowNFTModal(false);
					clearConfirmState();
				}}
				onMint={onMintNFT}
				deployHash={deployHash}
				isMinting={isMinting}
			/>
		</>
	);
};
