import React from 'react';
import { map } from 'lodash-es';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@cd/assets/image/search-icon.svg';
import { useFuse } from '@cd/components/hooks/useFuse';
import { useGetTokens } from '@cd/components/hooks/queries/useGetTokens';
import { getPublicKey } from '@cd/selectors/user';
import TokenItem from './TokenItem';

import './SearchToken.scss';

const SearchToken = () => {
    const publicKey = useSelector(getPublicKey);
    const { data: listTokens = [] } = useGetTokens();
    const { hits, query, onSearch } = useFuse(listTokens, {
        keys: ['name'],
        matchAllOnEmptyQuery: false,
        limit: 1000
    });
    const location = useLocation();
    const navigate = useNavigate();
	const {
		state: { nameKey },
	} = location;

    const handleOnClick = (tokenInfo) => {
        navigate('/swap', { state: { [nameKey]: tokenInfo, name: 'Swap' } });
    }

    const tokens = query ? map(hits, 'item') : listTokens;

    return (
        <section className="cd_we_search_token_wrapper">
            <div className="cd_we_search_token">
                <div className="cd_we_search_token_icon">
                    <SearchIcon />
                </div>
                <input className="cd_we_search_token_input" type="text" placeholder="Search token" onChange={onSearch} onKeyUp={onSearch}/>
            </div>

            <div className="cd_we_search_token_list cd_we_single_section">
                    {
                        tokens.map((tokenInfo) => {
                            return (
                               <TokenItem
                                    key={`${tokenInfo.type}-${tokenInfo.contractHash}`} 
                                    tokenInfo={tokenInfo} 
                                    onClick={() => handleOnClick(tokenInfo)} 
                                    publicKey={publicKey}
                               />
                            );
                        })
                    }
                    
            </div>
        </section>
    );
}

export default SearchToken;