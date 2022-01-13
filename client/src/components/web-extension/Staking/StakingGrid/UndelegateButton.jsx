import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export const UndelegateButton = (props) => {
	const navigate = useNavigate();

	const onUndelegate = () => {
		navigate('/undelegate', {
			state: { validator: props.validator, stakedAmount: props.stakedAmount, name: 'Undelegate' },
		});
	};
	return (
		<Button className="btn-primary-outline" onClick={onUndelegate}>
			{props.text}
		</Button>
	);
};
