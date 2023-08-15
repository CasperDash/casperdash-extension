import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { ENTRY_POINT_DELEGATE } from '@cd/constants/key';
import { getPendingStakes } from '@cd/selectors/stake';

export const UndelegateButton = (props) => {
	const navigate = useNavigate();
	const pendingStakes = useSelector(getPendingStakes());

	const onUndelegate = () => {
		navigate('/undelegate', {
			state: {
				validatorPublicKey: props.validator,
				stakedAmount: props.stakedAmount,
				validatorName: props.name,
				validatorIcon: props.icon,
				name: 'Undelegate'
			},
		});
	};
	return (
		<Button
			className="btn-primary-outline"
			onClick={onUndelegate}
			disabled={Array.isArray(pendingStakes) && pendingStakes.find((item) => props.validator === item.validator && item.entryPoint === ENTRY_POINT_DELEGATE)}
		>
			{props.text}
		</Button>
	);
};
