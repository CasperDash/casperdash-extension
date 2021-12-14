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
