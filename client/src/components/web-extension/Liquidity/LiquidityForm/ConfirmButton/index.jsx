import React from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useValidateSwap } from '@cd/web-extension/Swap/hooks';

const ConfirmButton = () => {
    const { isValid, error } = useValidateSwap();
	const navigate = useNavigate();


    const handleOnSwap = () => {
        navigate('/liquidityConfirmation', {
            state: {
                name: 'Liquidity Confirmation'
            }
        });
    }

    return (
        <Button 
            variant="primary" 
            className="cd_we_liquidity_confirm_button" 
            onClick={handleOnSwap}
            disabled={!isValid}
        >
            {isValid ? 'Add': error }
        </Button>
    );
}

export default ConfirmButton;