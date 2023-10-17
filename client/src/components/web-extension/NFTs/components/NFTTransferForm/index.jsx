import { Button, Form, FormControl } from 'react-bootstrap';
import React from 'react';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import { toMotes } from '@cd/helpers/currency';
import { useNavigate } from 'react-router-dom';
import { isValidPublicKey } from '@cd/helpers/validator';
import * as yup from 'yup';
import { PATHS } from '@cd/constants/paths';
import { useSendNFT } from '../../hooks/useSendNFT';
import { NFTConfirmTransfer } from '../NFTConfirmTransfer';
import { DISPLAY_TYPES } from '../../constants/displayTypes';


import './NFTTransferForm.scss';

const validationSchema = yup.object().shape({
    receivingAddress: yup
      .string()
      .required('Please enter receiving address')
      .test('isValidAddress', 'Invalid address', (value) => {
        if (!value || !isValidPublicKey(value)) {
          return false;
        }
  
        return true;
      }),
      fee: yup
      .number()
      .transform((_, value) => {
        if (typeof value !== 'string') {
          return value;
        }
  
        if (value?.includes('.')) {
          return parseFloat(value);
        }
  
        return +value.replace(/,/, '.');
      })
      .required('The entered amount is required.')
      .test('isValidFee', (value, context) => {
        if (!value) {
          return context.createError({
            message: 'The entered amount is required.',
          });
        }
  
        if (context.parent.balance < value) {
          return context.createError({
            message: `Please make sure you have at least ${value} CSPR in your active balance before attempting to send.`,
          });
        }
  
        return true;
      }),
  });

export const NFTTransferForm = ({onCancel, nftDetails}) => {
    const navigate = useNavigate();

    const { send, isLoading } = useSendNFT({
        onError: (err) => {
            toast.error(err.message ?? 'Something went wrong');
        },
        onSuccess: () => {
            navigate({
                pathname: PATHS.NFTS,
                search: `?displayType=${DISPLAY_TYPES.HISTORIES}`
            });
        }
    });

    const [isShowConfirmForm, setIsShowConfirmForm] = React.useState(false);
    const onSubmit = (values) => {
        if (!isShowConfirmForm) {
            setIsShowConfirmForm(true);

            return;
        }

        send({
            contractAddress: nftDetails.contractAddress,
            tokenId: nftDetails.tokenId,
            toPublicKeyHex: values.receivingAddress,
            tokenStandardId: nftDetails.tokenStandardId,
            paymentAmount: toMotes(values.fee),
            name: nftDetails.name,
            image: nftDetails.image,
            isUsingSessionCode: nftDetails.isUsingSessionCode,
            wasmName: nftDetails.wasmName,
        });
    }

    return (
        <Formik
	initialValues={{
            fee: nftDetails.fee,
            receivingAddress: '',
        }}
	onSubmit={onSubmit}
	validationSchema={validationSchema}
        >
        {({ errors, values, handleChange, handleSubmit }) => (
            <Form noValidate onSubmit={handleSubmit} className="cd_we_transfer_nft">
                {
                    isShowConfirmForm ? (
                        <NFTConfirmTransfer nftDetails={{
                            ...nftDetails,
                            ...values,
                        }} onCancel={onCancel}
                        />
                    ): (
                        <div>
                    <div className="cd_we_send_address">
                        <div className="cd_we_input_label">Receiving Address</div>
                        <FormControl
	value={values.receivingAddress}
	name="receivingAddress"
	required
	className="cd_we_send_input"
	onChange={handleChange}
	isInvalid={errors.receivingAddress}
	placeholder="Enter receiving address"
                        />

                        <Form.Control.Feedback type="invalid">{errors.toAddress}</Form.Control.Feedback>
                    </div>

                    <div className="cd_we_send_amount">
                        <div className="cd_we_input_label">Fee Network</div>
                        <div className="cd_we_amount_input">
                            <FormControl
	value={values.fee}
	name="fee"
	required
	type="number"
	className="cd_we_send_input"
	onChange={handleChange}
                            />
                        </div>
                        <Form.Control.Feedback type="invalid">{errors.fee}</Form.Control.Feedback>
                    </div>
                </div>
                    )
                }
                <div className="cd_we_transfer_nft__footer">
                    <Button variant="normal" className="cd_we_transfer_nft__button" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button className="cd_we_transfer_nft__button"
	disabled={isLoading || (errors && Object.keys(errors).length)}
	type="submit"
                    >
                        { isShowConfirmForm ? 'Sign' : 'Confirm' }
                    </Button>
                </div>
            </Form>
        )}
    </Formik>
    )
}