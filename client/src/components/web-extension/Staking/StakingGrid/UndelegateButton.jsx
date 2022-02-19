import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { getPendingStakes } from '../../../../selectors/stake';

export const UndelegateButton = (props) => {
	const navigate = useNavigate();
	const pendingStakes = useSelector(getPendingStakes());

	const onUndelegate = () => {
		navigate('/undelegate', {
			state: { validator: props.validator, stakedAmount: props.stakedAmount, name: 'Undelegate' },
		});
	};
	return (
		<Button
			className="btn-primary-outline"
			onClick={onUndelegate}
			disabled={Array.isArray(pendingStakes) && pendingStakes.find((item) => props.validator === item.validator)}
		>
			{props.text}
		</Button>
	);
};
