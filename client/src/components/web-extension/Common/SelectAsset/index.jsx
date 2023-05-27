import React, { useEffect } from 'react';
import ArrowOutlineDownIcon from '@cd/assets/image/arrow-outline-down.svg';
import { useNavigate, useLocation } from 'react-router-dom';

import './SelectAsset.scss';

const SelectAsset = ({ name, value = {}, onSelect, onChangeAmount, amountUsd = 0, balance = 0 }) => {
	const navigate = useNavigate();
    const location = useLocation();
    const {
        state,
    } = location;

    const handleOnClick = (e) => {
        e.preventDefault();
        navigate('/searchToken', { state: { name: 'Search Token', nameKey: name } });
    }

    useEffect(() => {
        if (state && state[name]) {
            onSelect({
                ...state[name],
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, name]);

    return (
		<div className="cd_we_select_asset_wrapper">
            <div className="cd_we_select_asset">
                <div className="cd_we_select_asset_main">
                    <div className="cd_we_select_asset_content" onClick={handleOnClick}>
                        {
                            value.symbol ? (
                                <>
                                    <div className="cd_we_select_asset_icon">
                                        <img src={value.logoURI} alt={value.symbol} width={'16px'} height={'16px'}/>
                                    </div>
                                    <div className="cd_we_select_asset_name">
                                        <span>{value.symbol}</span>
                                    </div>
                                </>
                            ): (
                                <div className="cd_we_select_asset_empty">
                                    Select Token
                                </div>
                            )
                            
                        }
                        <div className="cd_we_select_asset_arrow">
                            <ArrowOutlineDownIcon/>
                        </div>
                    </div>
                    <div className="cd_we_select_asset_balance">
                        <input
                            id={name}
                            name={name}
                            type="number"
                            required
                            value={value.value}
                            onChange={(e) => onChangeAmount(e.target.value)}
                            placeholder="0.0"
                            max={balance}
                            disabled={!value.contractHash}
                        />
                    </div>
                </div>
                <div className="cd_we_select_asset_footer">
                    <div className="cd_we_select_asset_balance2">
                        <span>Balance: </span>
                        <span>{balance}</span>
                    </div>
                    <div className="cd_we_select_asset_amount_usd">
                        ≈ ${amountUsd}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectAsset;