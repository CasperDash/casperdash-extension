import { Field, Formik } from 'formik';
import React, { useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { updateNFTLocalStorage } from '../../../../actions/NFTActions';
import { validateNftTransferForm } from '../../../../helpers/validator';
import { getTransferDeploy } from '../../../../services/nftServices';
import { useConfirmDeploy } from '../../../hooks/useConfirmDeploy';
import SelectField from '../CreateNFTs/SelectField';

const NFTTransferForm = ({ publicKey, NFTs }) => {
	const dispatch = useDispatch();
	const { executeDeploy } = useConfirmDeploy();
	const handleSubmit = async ({ tokenId, toAddress }) => {
		const foundNFT = NFTs.find((nft) => nft.tokenId === tokenId);
		if (!foundNFT?.contractAddress) {
			return;
		}

		const buildTransferDeploy = () => {
			return getTransferDeploy({
				publicKey,
				nftContract: foundNFT.contractAddress,
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
						collectionName: foundNFT.symbol,
						recipient: toAddress,
					},
					'push',
				),
			);
		}
	};

	return (
		<Formik onSubmit={handleSubmit} initialValues={{ toAddress: '', name: '' }} validate={validateNftTransferForm}>
			{({ values, errors, handleSubmit, handleChange, resetForm }) => (
				<Form noValidate onSubmit={handleSubmit} className="cd_nft_mint_form">
					<div className="cd_nft_mint_contract">
						<h3>NFT</h3>
						<Form.Group className="mb-3" controlId="cd_nft_mint_contract_dropdown">
							<Field
								name={'tokenId'}
								component={SelectField}
								options={NFTs.map((nft) => ({
									label: nft.nftName,
									symbol: nft.symbol,
									value: nft.tokenId,
								}))}
							/>
						</Form.Group>
						<Form.Control.Feedback type="invalid">{errors.nftContract}</Form.Control.Feedback>
					</div>
					<div className="cd_nft_transfer_recipient">
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
							Send
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default NFTTransferForm;
