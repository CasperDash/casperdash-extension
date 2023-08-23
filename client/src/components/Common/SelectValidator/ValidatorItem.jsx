import React from 'react';
import PropTypes from 'prop-types';
import { MiddleTruncatedText } from '@cd/common/MiddleTruncatedText';

import './ValidatorItem.scss';

const ValidatorItem = ({
   name = '',
   address = '',
   icon = 'https://avatars.githubusercontent.com/u/1025101?s=200&v=4'
}) => {

	return (
		<div className={'cd_we_validator_item'}>
			<div className={'cd_we_validator_item__icon'}>
				<img src={icon} alt="validator" width={36} height={36} />
			</div>
			<div className={'cd_we_validator_item__info'}>
				<div className={'cd_we_validator_item__name'}>
					<MiddleTruncatedText start={20} end={12}>
						{name}
					</MiddleTruncatedText>
				</div>
				<div className={'cd_we_validator_item__address'}>
					<MiddleTruncatedText start={8} end={8}>
						{address}
					</MiddleTruncatedText>
				</div>
			</div>
		</div>
	)
}

ValidatorItem.propTypes = {
	icon: PropTypes.string,
	name: PropTypes.string,
	address: PropTypes.string,
};

export default ValidatorItem;
