import PropTypes from 'prop-types';

import { TooltipText } from "@cd/components/Common/TooltipText/index"

export const FeeTooltip = ({ children }) => {
    return (
        <TooltipText
            tooltip={'This commission rate represents the percentage of the reward that the node operator retains for their services. For instance, a rate of 100% means the validator keeps all of the rewards, leaving zero to the delegators'}
            placement="top"
        >
            {children}
        </TooltipText>
    )
}

FeeTooltip.propTypes = {
	children: PropTypes.element,
};
