import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import _isArray from 'lodash-es/isArray';

const DeployField = ({ value, name }) => {
    const valueDisplay = _isArray(value) ? value.join(',') : value;
    return (
        <div key={name} className="cd_we_sign_deploy_field">
            <span>{name}</span>
            <OverlayTrigger
	placement="auto"
	overlay={
                        <Tooltip>
                            <span>
                            {valueDisplay}
                            </span>
                        </Tooltip>
                    }
            >
                    <div className="field_text">
                        {
                            valueDisplay
                        }
                    </div>
            </OverlayTrigger>
        </div>                
    );
};

export default DeployField;