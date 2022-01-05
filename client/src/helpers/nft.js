import { MAX_METADATA_ATTRIBUTES } from '../constants/nft';

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
