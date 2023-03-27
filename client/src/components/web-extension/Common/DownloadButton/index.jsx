import React from 'react';
import { Button } from 'react-bootstrap';

const download = (filename, text) => {
	let element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
};

export const DownloadButton = ({ text, className, fileName, variant }) => {
	const onDownload = () => {
		download(fileName, text);
	};

	return (
		<Button variant={variant || 'primary'} onClick={onDownload} className={className}>
			Download
		</Button>
	);
};
