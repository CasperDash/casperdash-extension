import React from 'react';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText';
import _isArray from 'lodash-es/isArray';

const DeployField = ({ value, name }) => {
    return (
        <div key={name} className="cd_we_sign_deploy_field">
            <span>{name}</span>
            <div className="long_text">
                {
                    _isArray(value) ? (
                        <MiddleTruncatedText end={4}>{value.join(',')}</MiddleTruncatedText>
                    ) : (
                        <MiddleTruncatedText end={4}>{value}</MiddleTruncatedText>
                    )
                }
            </div>
        </div>                
    );
};

export default DeployField;