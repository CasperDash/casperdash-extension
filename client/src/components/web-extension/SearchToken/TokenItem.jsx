import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useGetTokenBalance } from '@cd/components/hooks/queries/useGetTokenBalance';

const TokenItem = ({tokenInfo, onClick, publicKey}) => {
    const { data : { balance = 0 } = { balance: 0 }, isLoading } = useGetTokenBalance({
        type: tokenInfo.type,
        publicKey,
        contractHash: tokenInfo.contractHash,
        decimals: tokenInfo.decimals,
    });

    return (
        <div className="cd_we_search_token_item" onClick={onClick}>
            <div className="cd_we_search_token_item--content">
                <div className="cd_we_search_token_item--icon">
                    <img src={tokenInfo.logoURI} alt={tokenInfo.symbol} width={'16px'} height={'16px'}/>
                </div>
                <div className="cd_we_search_token_item--name">
                    <span>{tokenInfo.name}</span>
                </div>
            </div>
            <div className="cd_we_search_token_item--balance">
                {isLoading ? <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="cd_we_search_token_item--loading"
                             /> 
                             : balance
                }
            </div>
        </div>
    );
}

export default TokenItem;