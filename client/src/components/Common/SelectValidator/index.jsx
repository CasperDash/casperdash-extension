import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import ValidatorItem from '@cd/common/SelectValidator/ValidatorItem';
import ArrowDownIcon from '@cd/assets/image/arrow-down-icon.svg';

import './index.scss';

const SelectValidator = ({ name, publicKey, icon, onClick, className, isShowArrow = true }) =>  {
  return (
	<div className={clsx(['cd_we_select_validator', className])} onClick={onClick}>
		<div className={'cd_we_select_validator__label'}>
			{
				publicKey ? <ValidatorItem name={name} address={publicKey} icon={icon}/> :'Select a validator'
			}
		</div>
		<div className={'cd_we_select_validator__icon'}>
			{
				isShowArrow && <ArrowDownIcon />
			}
		</div>
	</div>
  );
}

SelectValidator.propTypes = {
  name: PropTypes.string,
  publicKey: PropTypes.string,
  icon: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  className: PropTypes.string,
  isShowArrow: PropTypes.bool,
};

export default SelectValidator;