import React from 'react';
import { Button } from 'react-bootstrap';
import { KeyFactory } from 'casper-storage';
import { useNavigate } from 'react-router-dom';
import { NUMBER_OF_WORD } from '../../../constants/key';
import './index.scss';

const COLUMNS = ['left', 'right'];

const CreateWallet = () => {
	const navigate = useNavigate();

	const keyManager = KeyFactory.getInstance();
	const mnemonicPhase = keyManager.generate();
	const phaseArray = mnemonicPhase.split(' ');

	return (
		<div className="cd_we_create_wallet">
			<div className="cd_recovery_phase">
				{COLUMNS.map((col, i) => {
					const rowPerCol = NUMBER_OF_WORD / COLUMNS.length;
					return (
						<div key={col} className={`cd_recovery_phase_${col}`}>
							{new Array(rowPerCol).fill().map((value, index) => {
								const wordIndex = rowPerCol * i + index;
								return (
									<div key={index}>
										<span>{wordIndex + 1}</span> {phaseArray[wordIndex]}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
			<Button
				onClick={() =>
					navigate('/doubleCheck', {
						state: {
							name: `Let's double check it`,
							phaseArray,
						},
					})
				}
			>
				Next
			</Button>
		</div>
	);
};

export default CreateWallet;
