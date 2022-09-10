import React, { useCallback } from 'react';
import { Button, Form as FormBS } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { KeyFactory } from 'casper-storage';
import { selectCreateWalletTotalKeywords } from '@cd/selectors/createWallet';
import { setNextStep, updateKeyphrase } from '@cd/actions/createWalletActions';
import SelectEncryptionType from '@cd/web-extension/Common/SelectEncryptionType';
import FieldKeyphrase from './FieldKeyphrase';

const ImportWallet = () => {
	const dispatch = useDispatch();
	const TOTAL_KEYWORDS = useSelector(selectCreateWalletTotalKeywords);

	const onValidate = useCallback((values) => {
		const { keyphrase } = values;
		const errors = {};

		/**
		 * Make sure keyphrase has 12 words
		 */
		if (keyphrase.some((key) => key === '')) {
			errors.keyphrase = 'Keyphrase required.';

			return errors;
		}

		/**
		 * Make sure keyphrase is valid with `KeyFactory.getInstance().validate(keyphrase)`
		 */
		if (!KeyFactory.getInstance().validate(keyphrase.join(' '))) {
			errors.keyphrase = 'Keyphrase is invalid. Please recheck your keyphrase.';

			return errors;
		}

		return errors;
	}, []);

	const onSubmit = (values) => {
		const { keyphrase } = values;

		dispatch(updateKeyphrase(keyphrase.join(' ')));
		dispatch(setNextStep());
	};

	return (
		<Formik
			initialValues={{
				keyphrase: new Array(TOTAL_KEYWORDS).fill(''),
			}}
			validate={onValidate}
			onSubmit={onSubmit}
		>
			{({ errors, touched, handleSubmit }) => {
				return (
					<Form noValidate onSubmit={handleSubmit} className="cd_we_create-wallet-layout--root">
						<SelectEncryptionType />
						<div className="cd_we_create-wallet-layout--body cd_we_create-keyphrase--box">
							<FieldKeyphrase totalWords={TOTAL_KEYWORDS} />
						</div>
						{errors.keyphrase && touched.keyphrase && (
							<FormBS.Text className="invalid-feedback">{errors.keyphrase}</FormBS.Text>
						)}
						<div className="cd_we_page--bottom">
							<Button className="cd_we_btn-next" type="submit">
								Next
							</Button>
						</div>
					</Form>
				);
			}}
		</Formik>
	);
};

ImportWallet.propTypes = {};

export default ImportWallet;
