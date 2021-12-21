import React, { useState, useEffect } from 'react';

export const ImagePreview = ({ file }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [thumb, setThumb] = useState();

	useEffect(() => {
		if (!file) {
			return;
		}
		setIsLoading(true);
		let reader = new FileReader();
		reader.onloadend = () => {
			setIsLoading(false);
			setThumb(reader.result);
		};
		reader.readAsDataURL(file);
	}, [file]);

	return (
		<>
			{isLoading && <div>Loading</div>}
			{file && !isLoading ? (
				<div className="cd_nft_image">
					<img src={thumb} alt={file.name} className="cd_img_thumbnail " />
				</div>
			) : null}
		</>
	);
};
