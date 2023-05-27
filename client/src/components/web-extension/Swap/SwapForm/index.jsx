import React from 'react';
import { useNavigate } from 'react-router-dom';
import { withServiceWorkerRequired } from '@cd/components/hocs/ServiceWorkerRequired';
import SelectSwapTo from './SelectSwapTo';
import SelectSwapFrom from './SelectSwapFrom';
import { ReverseButton } from './ReverseButton';
import { ConfirmSwapButton } from './ConfirmSwapButton';
import SwapInformation from './SwapInformation';
import RoutePaths from './RoutePaths';

import './SwapForm.scss';

const SwapForm = () => {
    const navigate = useNavigate();

    const handleAddLiquidity = () => {
        navigate('/liquidity', { state: { name: 'Liquidity' } });
    }

    return (
        <section className="cd_we_single_section no_bottom_bar">
           <div className="cd_we_swap">
              <span onClick={handleAddLiquidity}>Add Liquidity</span>
              <form>
                  <div className="cd_we_swap_from">
                    <SelectSwapFrom />
                  </div>
                  <div className="cd_we_swap_reverse_wrapper">
                    <ReverseButton />
                  </div>
                  <div className="cd_we_swap_to">
                    <SelectSwapTo />
                  </div>
                  <div className="cd_we_swap_confirm_button_wrapper">
                    <ConfirmSwapButton />
                  </div>
                  <RoutePaths />
                  <SwapInformation />
              </form>
           </div>
        </section>
    );
}

export default withServiceWorkerRequired(SwapForm);