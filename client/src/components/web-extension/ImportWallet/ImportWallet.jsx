import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { selectCreateWalletTotalKeywords } from "@cd/selectors/createWallet";
import FieldKeyphrase from "./FieldKeyphrase";
import './ImportWallet.scss';


const ImportWallet = () => {
	const TOTAL_KEYWORDS = useSelector(selectCreateWalletTotalKeywords);

	const onValidate = useCallback(values => {
		console.log(`🚀 ~ onValidate ~ values`, values)
		const { keyphrase } = values;
		const errors = {};

    /**
     * Make sure keyphrase has 12 words
     */


    /**
     * Make sure keyphrase is valid with `KeyFactory.getInstance().validate(keyphrase)`
     */

		return errors;
	}, []);

	return (
		<section className="cd_we_page--root">
			<Formik
				initialValues={{
					keyphrase: new Array(TOTAL_KEYWORDS).fill('')
				}}
				validate={onValidate}
				onSubmit={values => {
					// same shape as initial values
					console.log(values);
				}}
			>
				{({ errors, touched, setFieldValue, handleBlur, handleSubmit }) => {
					return (
						<Form noValidate onSubmit={handleSubmit}>
							<div className="cd_we_create-wallet-layout--root">
								<div className="cd_we_create-wallet-layout--body cd_we_create-keyphrase--box">
									<FieldKeyphrase totalWords={TOTAL_KEYWORDS} />
								</div>
								<div className="cd_we_page--bottom">
									<Button className="cd_we_btn-next" type="submit">
										Next
									</Button>
								</div>
							</div>
						</Form>
					)
				}}
			</Formik>
		</section>
	);
};

ImportWallet.propTypes = {};

export default ImportWallet;
