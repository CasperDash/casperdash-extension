import React from 'react';
import { DEPLOY_TYPES } from '@cd/constants/deployTypes';
import { getTokenStandardName } from '@cd/helpers/nft';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText';

import './NFTConfirmTransfer.scss';

export const NFTConfirmTransfer = ({nftDetails}) => {
    const listItems = [
        {
          title: 'Name',
          value: nftDetails.name,
        },
        {
          title: 'Token ID',
          value: `#${nftDetails.tokenId}`,
        },
        {
          title: 'Receiving Address',
          value: <MiddleTruncatedText end={8}>{nftDetails.receivingAddress}</MiddleTruncatedText>,
        },
        {
          title: 'Contract Package Hash',
          value:  <MiddleTruncatedText end={8}>{nftDetails.contractAddress}</MiddleTruncatedText>,
        },
        {
          title: 'Token Standard',
          value: getTokenStandardName(nftDetails.tokenStandardId),
        },
        {
          title: 'Transfer Type',
          value: nftDetails.isUsingSessionCode ? DEPLOY_TYPES.WASM : DEPLOY_TYPES.CONTRACT_CALL,
        },
        {
          title: 'Network Fee',
          value: `${nftDetails.fee} CSPR`,
        },
      ];

    return (
        <div className="cd_we_nft_confirm">
            {
                listItems.map(({title, value}) => (
                    <div key={title} className="cd_we_nft_confirm__attribute">
                        <div className="cd_we_nft_confirm__attribute--title">{title}</div>
                        <div className="cd_we_nft_confirm__attribute--value">{value}</div>
                    </div>
                ))
            }
        </div>
    )
}