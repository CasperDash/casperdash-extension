import React from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useValidate } from '@cd/web-extension/Liquidity/hooks';

const ConfirmButton = () => {
    const { isValid, error } = useValidate();
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
            {isValid ? 'Add Liquidity': error }
        </Button>
    );
}

export default ConfirmButton;