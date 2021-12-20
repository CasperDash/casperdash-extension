import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Button, Form, FormControl } from 'react-bootstrap';
import { Formik } from 'formik';
import { putDeploy } from '../../../actions/deployActions';
import { updateNFTLocalStorage } from '../../../actions/NFTActions';
import { nftContractDeploy } from '../../../services/nftServices';

export const DeployConfirmModal = ({ show, handleClose, publicKey }) => {
	const dispatch = useDispatch();

	const [step, setStep] = useState('input');
	const [inputValues, setInputValues] = useState({ collectionName: '', collectionSymbol: '' });
	const [deployError, setDeployError] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [deployHash, setDeployHash] = useState();

	const formRef = useRef();

	const validate = (values) => {
		let errors = {};
		if (!values.collectionName) {
			errors.collectionName = 'Required';
		}
		if (!values.collectionSymbol) {
			errors.collectionSymbol = 'Required';
		}
		return errors;
	};

	const handleSubmit = (values) => {
		setInputValues(values);
		setStep('confirm');
	};

	const onNext = () => {
		if (formRef.current) {
			formRef.current.handleSubmit();
		}
	};

	const handleConfirmDeployContract = async () => {
		setIsLoading(true);
		const deploy = await nftContractDeploy(publicKey, inputValues.collectionName, inputValues.collectionSymbol);
		if (deploy.error) {
			setIsLoading(false);
			setDeployError(deploy.error.message);
			return;
		} else {
			const { data: hash } = await dispatch(putDeploy(deploy));
			setDeployHash(hash.deployHash);
			dispatch(
				updateNFTLocalStorage(
					publicKey,
					`nfts.deploys.installContract`,
					{ hash: hash.deployHash, status: 'pending' },
					'push',
				),
			);
			setIsLoading(false);
		}
	};

	return (
		<Modal show={show} onHide={handleClose} size="lg" centered className="cd_nft_contract_deploy_modal">
			<Modal.Header closeButton>
				<Modal.Title>Deploy NFT Contract</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				{step === 'input' ? (
					<>
						<Formik
							innerRef={formRef}
							onSubmit={handleSubmit}
							initialValues={{ ...inputValues }}
							validate={validate}
						>
							{({ values, errors, handleSubmit, handleChange }) => (
								<Form noValidate onSubmit={handleSubmit} className="cd_nft_mint_form">
									<div className="cd_nft_contract_row">
										<h3>Collection Name *</h3>
										<FormControl
											placeholder="Name"
											name="collectionName"
											value={values.collectionName}
											onChange={handleChange}
											isInvalid={errors.collectionName}
										/>
										<Form.Control.Feedback type="invalid">
											{errors.collectionName}
										</Form.Control.Feedback>
									</div>
									<div className="cd_nft_contract_row">
										<h3>NFT Symbol *</h3>
										<FormControl
											placeholder="Symbol"
											name="collectionSymbol"
											value={values.collectionSymbol}
											onChange={handleChange}
											isInvalid={errors.collectionSymbol}
										/>
										<Form.Control.Feedback type="invalid">
											{errors.collectionSymbol}
										</Form.Control.Feedback>
									</div>
								</Form>
							)}
						</Formik>
					</>
				) : (
					<div>
						<div className="cd_nft_contract_row">
							<h3>Collection Name</h3>
							<h4>{inputValues.collectionName}</h4>
						</div>
						<div className="cd_nft_contract_row">
							<h3>NFT Symbol</h3>
							<h4>{inputValues.collectionSymbol}</h4>
						</div>
						<div className="cd_nft_contract_row">
							<h3>Network Fee</h3>
							<h4>100 CSPR</h4>
						</div>
						<p className="cd_nft_contract_confirm_notice">
							* By confirm this, a NFT contract will be deployed on your account.
						</p>
						<p className="cd_nft_contract_confirm_notice">
							** The contract was built based on{' '}
							<a
								href="https://github.com/casper-ecosystem/casper-nft-cep47"
								target="_blank"
								rel="noopener noreferrer"
							>
								https://github.com/casper-ecosystem/casper-nft-cep47.
							</a>
						</p>
					</div>
				)}
			</Modal.Body>

			<Modal.Footer>
				{!deployHash ? (
					<>
						<div className="cd_error_text">
							<span>{deployError}</span>
						</div>

						{step === 'confirm' ? (
							<>
								<Button variant="secondary" onClick={() => setStep('input')}>
									Back
								</Button>
								<Button variant="primary" onClick={handleConfirmDeployContract} disabled={isLoading}>
									{isLoading ? 'Confirming...' : 'Confirm'}
								</Button>
							</>
						) : (
							<Button variant="primary" onClick={onNext}>
								Next
							</Button>
						)}
					</>
				) : (
					<>
						<div className="cd_success_text">
							<span>{deployHash}</span>
						</div>

						<Button variant="secondary" onClick={handleClose}>
							close
						</Button>
					</>
				)}
			</Modal.Footer>
		</Modal>
	);
};
