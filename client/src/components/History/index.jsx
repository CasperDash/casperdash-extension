import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAutoRefreshEffect } from '../hooks/useAutoRefreshEffect';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { Tab, Nav } from 'react-bootstrap';
import { getMassagedUserDetails } from '../../selectors/user';
import AllList from '../Common/Layout/TransactionList/AllTransactionList';
import { getCurrentPrice } from '../../selectors/price';
import { toFormattedNumber } from '../../helpers/format';
import { getTransfersFromLocalStorage } from '../../actions/deployActions';
import { getTransfersDeploy } from '../../selectors/deploy';
import { getPublicKey } from '../../selectors/user';
import { TokenList } from '../Common/TokenList';
import { getMassagedTokenData, getTokensAddressList } from '../../selectors/tokens';
import { fetchTokensInfoWithBalance } from '../../actions/tokensActions';

const CSPR_INFO = {
	symbol: 'CSPR',
	address: 'CSPR',
};

const PortfolioModule = () => {
	const dispatch = useDispatch();
	// State
	const [selectedToken, setSelectedToken] = useState({});

	// Selector
	const userDetails = useSelector(getMassagedUserDetails);
	const currentPrice = useSelector(getCurrentPrice);
	const publicKey = useSelector(getPublicKey);
	const transferList = useSelector(getTransfersDeploy(selectedToken.symbol));
	const tokensInfo = useSelector(getMassagedTokenData);
	const tokensAddressList = useSelector(getTokensAddressList);

	const displayBalance = userDetails && userDetails.balance ? userDetails.balance.displayBalance : 0;
	const tokensInfoWithCSPR = [
		{ ...CSPR_INFO, balance: { displayValue: displayBalance }, price: currentPrice },
		...tokensInfo,
	];

	// Effects
	useAutoRefreshEffect(() => {
		dispatch(fetchTokensInfoWithBalance(tokensAddressList, publicKey));
	}, [publicKey, JSON.stringify(tokensAddressList)]);

	useEffect(() => {
		dispatch(getTransfersFromLocalStorage(publicKey));
	}, [dispatch, publicKey]);

	// Functions
	const onTokenClick = (address) => {
		const token = tokensInfoWithCSPR.find((tk) => tk.address === address);
		setSelectedToken(token || {});
	};

	return (
		<>
			<section className="cd_history_page">
				<HeadingModule name={'History'} />
				<Tab.Container id="left-tabs-example" defaultActiveKey="tab1">
					<div className="cd_add_token_content cd_add_token_row row">
						<div className="cd_currency_column_sub_row_full">
							<div className="cd_add_token_column col" onClick={onTokenClick}>
								<div className={`cd_all_currency_content ${selectedToken.address ? '' : 'active'}`}>
									All Transactions
								</div>
							</div>
							<TokenList
								tokensInfo={tokensInfoWithCSPR}
								selectedToken={selectedToken}
								onTokenClick={onTokenClick}
							/>
						</div>
					</div>
					<Tab.Content>
						<Tab.Pane eventKey="tab1">
							<AllList transfersDeployList={transferList} />
						</Tab.Pane>
					</Tab.Content>
				</Tab.Container>
			</section>
		</>
	);
};

export default PortfolioModule;
