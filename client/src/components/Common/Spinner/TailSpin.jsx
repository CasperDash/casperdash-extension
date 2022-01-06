import React from 'react';

const TailSpin = ({ width = 80, height = 80 }) => {
	return (
		<div>
			<svg
				width={width}
				height={height}
				viewBox="0 0 38 38"
				xmlns="http://www.w3.org/2000/svg"
				aria-label="loading-indicator"
			>
				<g fill="none" fillRule="evenodd">
					<g transform="translate(1 1)">
						<path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="green" strokeWidth="2">
							<animateTransform
								attributeName="transform"
								type="rotate"
								from="0 18 18"
								to="360 18 18"
								dur="0.9s"
								repeatCount="indefinite"
							/>
						</path>
						<circle fill="#fff" cx="36" cy="18" r="1">
							<animateTransform
								attributeName="transform"
								type="rotate"
								from="0 18 18"
								to="360 18 18"
								dur="0.9s"
								repeatCount="indefinite"
							/>
						</circle>
					</g>
				</g>
			</svg>
		</div>
	);
};

export default TailSpin;
