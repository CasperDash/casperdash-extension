import React from 'react';
import { withServiceWorkerRequired } from '@cd/components/hocs/ServiceWorkerRequired';
import SelectTo from './SelectTo';
import SelectFrom from './SelectFrom';
import ConfirmButton from './ConfirmButton';
import LiquidityInformation from './LiquidityInformation';

import './LiquidityForm.scss';

const LiquidityForm = () => {
    return (
        <section className="cd_we_single_section no_bottom_bar">
           <div className="cd_we_liquidity">
              <form>
                  <div className="cd_we_liquidity_from">
                    <SelectFrom />
                  </div>
                  <div className="cd_we_liquidity_reverse_wrapper">
                    {/* <ReverseButton /> */}
                  </div>
                  <div className="cd_we_liquidity_to">
                    <SelectTo />
                  </div>
                  <div className="cd_we_liquidity_confirm_button_wrapper">
                    <ConfirmButton />
                  </div>
                  <LiquidityInformation />
              </form>
           </div>
        </section>
    );
}

export default withServiceWorkerRequired(LiquidityForm);