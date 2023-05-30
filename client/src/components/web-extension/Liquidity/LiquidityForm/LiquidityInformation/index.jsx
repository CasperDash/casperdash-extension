import React from 'react';
import { useGetLiquidityInformations } from '../../hooks';

import './LiquidityInformation.scss';

const LiquidityInformation = () => {
    const swapInformations = useGetLiquidityInformations();
    if (swapInformations.length === 0) {
      return null;
    }

    return (
      <div className="cd_we_swap_explain">
        {
          swapInformations.map((swapInformation) => {
            const { title, value, id } = swapInformation;
            return (
              <div key={`swap-info-${id}`} className="cd_we_swap_explain_item">
                <span>{title}</span>
                <span>{value}</span>
              </div>
            )
          })
        }
      </div>
    )
}

export default LiquidityInformation;