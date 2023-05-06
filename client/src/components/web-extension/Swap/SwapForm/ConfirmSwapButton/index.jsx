import React from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useValidateSwap } from '@cd/web-extension/Swap/hooks';

export const ConfirmSwapButton = () => {
    const { isValid, error } = useValidateSwap();
	const navigate = useNavigate();


    const handleOnSwap = () => {
        navigate('/swapConfirmation', {
            state: {
                name: 'Swap Confirmation'
            }
        });
    }

    return (
        <Button 
            variant="primary" 
            className="cd_we_swap_confirm_button" 
            onClick={handleOnSwap}
            disabled={!isValid}
        >
            {isValid ? 'Swap': error }
        </Button>
    );
}