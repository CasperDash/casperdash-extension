import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Modal from 'react-bootstrap/Modal';
import { Form, FormControl } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import './ConfirmDeleteAllDataModal.scss';

const ConfirmDeleteAllDataModal = ({ isOpen, onSubmit, onCloseModal, closeButton = true }) => {
	const formik = useFormik({
		initialValues: {
			word: '',
		},
		validationSchema: Yup.object({
			word: Yup.string().required('Input is required').equals(['RESET'], 'Please type RESET to confirm'),
		}),
		onSubmit: (values) => {
			onSubmit?.(values.word);
		},
	});

	const { errors } = formik;

	return (
		<Modal
			backdropClassName="cd_we_confirm-delete-modal--backdrop"
			onHide={onCloseModal}
			show={isOpen}
			className="cd_we_confirm-delete-modal"
			centered
		>
			<Modal.Header closeButton={closeButton}>
				<Modal.Title>Confirm Reset All Data</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="cd_we_create-wallet-layout--root">
					<div className="layout--body">
						<form onSubmit={formik.handleSubmit}>
							<Form.Group className="mb-3">
								<Form.Label>
									Type <span className={'cd_we_confirm-delete-modal--word'}>RESET</span> to confirm
								</Form.Label>
								<FormControl
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									name="word"
									type="text"
								/>
								{errors.word && <Form.Text className="text-danger">{errors.word}</Form.Text>}
							</Form.Group>

							<Button
								className={'cd_we_confirm-delete-modal--confirm-btn'}
								variant="primary"
								type="submit"
							>
								Confirm
							</Button>
						</form>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

ConfirmDeleteAllDataModal.propTypes = {
	onSubmit: PropTypes.func,
	onCloseModal: PropTypes.func,
	isOpen: PropTypes.bool,
	closeButton: PropTypes.bool,
};

export default ConfirmDeleteAllDataModal;
