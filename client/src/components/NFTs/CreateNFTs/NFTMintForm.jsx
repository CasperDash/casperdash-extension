import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, FormControl } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import { putDeploy } from '../../../actions/deployActions';
import { storeFile } from '../../../actions/fileActions';
import { getSingedMintDeploy } from '../../../services/nftServices';
import { ImagePreview } from '../../Common/Image/ImagePreview';
import { NFTModal } from '../NFTModal';
import SelectField from './SelectField';
import { NFTAttributeRow } from './NFTAttributeRow';

const MAX_METADATA_ATTRIBUTES = 5;

const validate = (values) => {
	let errors = {};
	if (!values.nftContract) {
		errors.nftContract = 'required';
	}
	if (!values.name) {
		errors.name = 'required';
	}
	if (!values.image) {
		errors.image = 'required';
	}

	return errors;
};

const massageFormValues = (values) => {
	const metadataAttributes = new Array(MAX_METADATA_ATTRIBUTES)
		.fill()
		.map((el, index) => {
			const attribute = values[`attribute${index}`];
			const value = values[`value${index}`];
			if (!attribute || !value) {
				return;
			}
			return { key: attribute, value: value, name: attribute };
		})
		.filter(Boolean);
	return {
		nftContract: values.nftContract,
		recipient: values.toAddress,
		metadata: [
			{ key: 'name', value: values.name, name: 'name' },
			{ key: 'image', value: values.image, name: 'image' },
			...metadataAttributes,
		],
	};
};

export const NFTMintForm = ({ publicKey, nftContracts }) => {
	const dispatch = useDispatch();

	// State
	const [attributes, setAttributes] = useState([{ attribute0: '', value0: '' }]);
	const [showNFTModal, setShowNFTModal] = useState(false);
	const [nftInfo, setNFTInfo] = useState({});
	const [previewMetadata, setPreviewMetaData] = useState([]);
	const [signerError, setSignerError] = useState('');
	const [deployHash, setDeployHash] = useState();

	// function
	const onMintNFT = async () => {
		const { data: cid } = await dispatch(storeFile(nftInfo.metadata.find((attr) => attr.name === 'image').value));
		const nftMetadata = nftInfo.metadata.map((attr) => {
			return [attr.name, attr.name !== 'image' ? attr.value : cid.cid];
		});

		const signedDeploy = await getSingedMintDeploy({ ...nftInfo, metadata: nftMetadata, publicKey });
		if (!signedDeploy.error) {
			const { data: hash } = await dispatch(putDeploy(signedDeploy));
			setDeployHash(hash.deployHash);
		} else {
			setSignerError(signedDeploy.error);
		}
	};

	const handleSubmit = async (values) => {
		const nftInfo = massageFormValues(values);

		setPreviewMetaData(nftInfo.metadata);
		setNFTInfo(nftInfo);
		setShowNFTModal(true);
	};

	const onAddNewAttribute = () => {
		if (attributes.length >= 4) {
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

	return (
		<>
			<Formik onSubmit={handleSubmit} initialValues={{ toAddress: '', name: '' }} validate={validate}>
				{({ values, errors, handleSubmit, handleChange, setFieldValue }) => (
					<Form noValidate onSubmit={handleSubmit} className="cd_nft_mint_form">
						<div className="cd_nft_mint_contract">
							<h3>NFT Contract</h3>
							<Form.Group className="mb-3" controlId="cd_nft_mint_contract_dropdown">
								<Field name={'nftContract'} component={SelectField} options={nftContracts} />
							</Form.Group>
							<Form.Control.Feedback type="invalid">{errors.nftContract}</Form.Control.Feedback>
						</div>
						<div className="cd_nft_mint_recipient">
							<h3>Recipient</h3>
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
								<h4>Name</h4>
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
								<h4>Image File</h4>
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
							<Button type="submit" onClick={handleSubmit} className="cd_send_currency_btn">
								Mint
							</Button>
						</div>
					</Form>
				)}
			</Formik>
			<NFTModal
				show={showNFTModal}
				metadata={previewMetadata}
				handleClose={() => setShowNFTModal(false)}
				onMint={onMintNFT}
				deployError={signerError}
				deployHash={deployHash}
			/>
		</>
	);
};
