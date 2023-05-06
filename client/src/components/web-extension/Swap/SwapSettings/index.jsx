import React from 'react';
import clsx from 'clsx';
import { useSwapSettings } from '../hooks';
import RadioButtonGroup from './RadioButton/RadioButtonGroup';
import RadioButton from './RadioButton/RadioButton';

import './SwapSettings.scss';

const SwapSettings = () => {
    const [swapSettings = {}, setValue] = useSwapSettings();

    const handleSlippageChange = (value) => {
      setValue({ slippage: value } );
    }

    const handleDeadlineChange = (value) => {
      setValue({ deadline: value });
    }

    return (
        <section className="cd_we_single_section no_bottom_bar">
          <div className="cd_we_swap_settings">
              <div >
                  <div className="cd_we_swap_settings_label">Slippage Tolerance (%)</div>
                  <div>
                      <RadioButtonGroup name="slippage" onChange={handleSlippageChange} value={swapSettings.slippage} className="cd_we_swap_settings_slippage_group">
                        {
                          [0.1, 0.5, 1].map((item) => {
                            return (
                              <RadioButton key={item} value={item}>
                                <div className={
                                  clsx('cd_we_swap_settings_slippage_item', {
                                    'cd_we_swap_settings_slippage_item_checked': item === swapSettings.slippage
                                    })
                                  }
                                >
                                  {item} %
                                </div>
                              </RadioButton>
                            )
                          })
                        }
                      </RadioButtonGroup>
                  </div>
                  <div className="cd_we_swap_settings_slippage_input">
                    <input type="number" onChange={(e) => handleSlippageChange(e.target.value)} value={swapSettings.slippage}/>
                  </div>
              </div>
              <div className="cd_we_swap_settings_transaction_deadline">
                  <div className="cd_we_swap_settings_label">Transaction Deadline (minutes)</div>
                  <div className="cd_we_swap_settings_transaction_deadline_input">
                    <input type="number" onChange={(e) => handleDeadlineChange(e.target.value)} value={swapSettings.deadline}/>
                  </div>
              </div>
          </div>
        </section>
    );
}

export default SwapSettings;