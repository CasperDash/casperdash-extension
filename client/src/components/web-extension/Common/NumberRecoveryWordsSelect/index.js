import React from 'react';
import { Button } from 'react-bootstrap';
import { NUMBER_OF_RECOVERY_WORDS } from '@cd/constants/key';

import './style.scss';

const NumberRecoveryWordsSelect = ({ onChange = () => {}, selectedValue }) => {
	return (
		<div className="cd_we_number_of_words">
			{NUMBER_OF_RECOVERY_WORDS.map((number) => {
				return (
					<Button
						key={number}
						onClick={() => onChange(number)}
						variant={selectedValue === number ? 'primary' : 'normal'}
					>
						{number}
					</Button>
				);
			})}
		</div>
	);
};

export default NumberRecoveryWordsSelect;
