import React from 'react';
import clsx from 'clsx';
import { toCSPR } from '@cd/helpers/currency';
import { toFormattedDate } from '@cd/helpers/format';
import { mapTransactionStatus } from '@cd/helpers/transaction';
import { useNavigate } from 'react-router-dom';
import nftHeaderImage from '@cd/assets/image/nft-header.png';
import NoData from '@cd/components/Common/NoData';
import Bar from '@cd/components/Common/Spinner/Bar';
import { PATHS } from '@cd/constants/paths';
import { useGetNFTHistories } from '../../hooks/useGetNFTHistories';

import './NFTHistories.scss';


export const NFTHistories = () => {
    const navigate = useNavigate();
    const { data = [], isLoading } = useGetNFTHistories();
    const handleOnClick = (item) => {
        navigate(PATHS.NFT_TRANSFER_HISTORY, { state: { deploy: item, name: 'Transaction details' } });
    }

    if (isLoading) {
        return <Bar />;
    }

    if (data.length === 0) {
        return <div className="cd_we_nft_histories"><NoData /></div>
    }

    return (
        <div className="cd_we_nft_histories">
            <div>
                {
                    data?.map((item) => {
                        const transactionStatus = mapTransactionStatus(item.status);

                        return (
                            <div key={item.id} className="cd_we_nft_histories__item" onClick={() => handleOnClick(item)}>
                               <div className="cd_we_nft_histories__item--left">
                                    <div className="cd_we_nft_histories__item--image-wrapper">
                                        <img src={item.image} alt="image" width={40} height={40} onError={(e) => {
                                                e.target.error = null;
                                                e.target.src = nftHeaderImage;
                                            }}
                                        />
                                    </div>
                                    <div className="cd_we_nft_histories__item--info">
                                        <div className="cd_we_nft_histories__item--name">
                                            {item.name}
                                        </div>
                                        <div className="cd_we_nft_histories__item--date">{toFormattedDate(item.timestamp)}</div>
                                    </div>
                                </div>
                                <div className="cd_we_nft_histories__item--right">
                                    <div className={clsx('cd_we_nft_histories__item--status', transactionStatus.className)}>{transactionStatus.label}</div>
                                    <div className="cd_we_nft_histories__item--amount">{toCSPR(item.paymentAmount).toNumber()} CSPR</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}