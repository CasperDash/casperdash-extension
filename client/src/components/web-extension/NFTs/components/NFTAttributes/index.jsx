import React from 'react';
import { MiddleTruncatedText } from '@cd/common/MiddleTruncatedText';
import Copy from '@cd/components/Common/Button/Copy';
import NoData from '@cd/common/NoData';

export const NFTAttributes = ({ nftDetails }) => {
    const { nftContractName, metadata, contractAddress, totalSupply } = nftDetails || {};

    return (
        <div className="cd_we_nft_content">
				<div className="cd_we_nft_content_header">
					<div className="cd_we_input_label">Collection</div>
					<div className="cd_we_nft_contract_name">{nftContractName}</div>
					{totalSupply && <div>Total supply: {totalSupply}</div>}
					<div className="cd_we_nft_contract">
						<div className="cd_we_nft_contract_address">
							<MiddleTruncatedText>{contractAddress}</MiddleTruncatedText>
						</div>
						<Copy value={contractAddress} />
					</div>
				</div>

				<div className="cd_we_nft_attr">
					<div className="cd_we_nft_attr_header cd_we_input_label">Attributes</div>
					{metadata && metadata.length ? (
						<div className="cd_we_nft_attr_grid hide_scroll_bar">
							{metadata.map(({ key, value }) => {
								return (
									<div key={key} className="cd_we_nft_attr_card">
										<div className="cd_we_nft_attr_key">{key}</div>
										<div className="cd_we_nft_attr_value">{value}</div>
									</div>
								);
							})}
						</div>
					) : (
						<NoData message="No Attributes" />
					)}
				</div>
			</div>
    )
                    };