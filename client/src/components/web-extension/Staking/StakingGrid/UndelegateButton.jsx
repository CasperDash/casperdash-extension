import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';
import { ENTRY_POINT_DELEGATE } from '@cd/constants/key';
import { getPendingStakes } from '@cd/selectors/stake';
import { getValidators } from '@cd/selectors/validator';

import './UndelegateButton.scss';

export const UndelegateButton = (props) => {
	const navigate = useNavigate();
	const pendingStakes = useSelector(getPendingStakes());
	const validators = useSelector(getValidators());

	const onUndelegate = (e) => {
		e.preventDefault();

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

	const onDelegate = (e) => {
		e.preventDefault();

		const foundValidator = validators.find((validator) => validator.validatorPublicKey === props.validator);

		navigate('/staking', {
			state: {
				validator: foundValidator
			},
		});
	}

	return (
			<DropdownButton
				as={ButtonGroup}
				className="cd_we_btn_staking_action"
				title={`Actions`}
			>
				<Dropdown.Item
					disabled={Array.isArray(pendingStakes) && pendingStakes.find((item) => props.validator === item.validator && item.entryPoint === ENTRY_POINT_DELEGATE)}
					onClick={onDelegate}
				>
					Delegate
				</Dropdown.Item>
				<Dropdown.Item onClick={onUndelegate}>Undelegate</Dropdown.Item>
			</DropdownButton>
	);
};
