import { TOKEN_STANDARDS } from '@cd/constants/tokenStandards';
import { MAX_METADATA_ATTRIBUTES } from '../constants/nft';

/**
 * It takes the form values and returns a new object with the form values that are relevant to the NFT
 * minting transaction
 * @param values - The form values.
 */
export const massageNFTMintFormValues = (values) => {
	const metadataAttributes = new Array(MAX_METADATA_ATTRIBUTES)
		.fill()
		.map((el, index) => {
			const attribute = values[`attribute${index}`];
			const value = values[`value${index}`];
			if (!attribute || !value) {
				return;
			}
			return { key: attribute.trim(), value: value.trim(), name: attribute.trim() };
		})
		.filter(Boolean);
	return {
		nftContract: values.nftContract,
		recipient: values.toAddress,
		nftName: values.name.trim(),
		image: values.image,
		metadata: metadataAttributes,
	};
};


export const getTokenStandardName = (tokenStandardId) => {
	switch (tokenStandardId) {
	  case TOKEN_STANDARDS.CEP47:
		return 'CEP47';
	  case TOKEN_STANDARDS.CEP78:
		return 'CEP78';
	  default:
		return '';
	}
  };