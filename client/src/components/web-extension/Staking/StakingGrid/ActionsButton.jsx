import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePopper } from "react-popper";
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { ENTRY_POINT_DELEGATE } from '@cd/constants/key';
import { getPendingStakes } from '@cd/selectors/stake';
import { getValidators } from '@cd/selectors/validator';

import './UndelegateButton.scss';

export const ActionsButton = (props) => {
	const [visible, setVisibility] = useState(false);
	const referenceRef = useRef(null);
	const popperRef = useRef(null);
	const navigate = useNavigate();
	const pendingStakes = useSelector(getPendingStakes());
	const validators = useSelector(getValidators());

	const { styles, attributes, update } = usePopper(
		referenceRef.current,
		popperRef.current,
		{
			placement: "top-start",
			modifiers: [
				{
					name: "offset",
					enabled: true,
					options: {
						offset: [20, 2]
					}
				}
			]
		}
	);

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

		setVisibility(false);
		update?.();
	}

	const handleDocumentClick = (event) => {
		if (popperRef.current.contains(event.target) || referenceRef.current.contains(event.target)) {
			return;
		}

		setVisibility(false);
		update?.();
	}

	const handleDropdownClick = () => {
		if (visible) {
			referenceRef.current.blur();
		}

		setVisibility(!visible);
		update?.();
	}

	useEffect(() => {
		// listen for clicks and close dropdown on body
		document.addEventListener("mousedown", handleDocumentClick);
		return () => {
			document.removeEventListener("mousedown", handleDocumentClick);
		};
	}, []);

	return (
		<>
			<Button
				ref={referenceRef}
				className={'btn-primary-outline'}
				onClick={handleDropdownClick}
			>
				{props.text}
			</Button>
			<div ref={popperRef} style={styles.popper} {...attributes.popper}>
				{
					visible && (
						<div className="cd_we_staking_info_dropdown">
							<button
								className="cd_we_staking_info_dropdown_item"
								onClick={onDelegate}
							>
								Delegate
							</button>
							<div className="cd_we_staking_info_dropdown_divider" />
							<button
								className="cd_we_staking_info_dropdown_item"
								onClick={onUndelegate}
								disabled={Array.isArray(pendingStakes) && pendingStakes.find((item) => props.validator === item.validator && item.entryPoint === ENTRY_POINT_DELEGATE)}
							>
								Undelegate
							</button>
						</div>
					)
				}
			</div>
		</>
	);
};
