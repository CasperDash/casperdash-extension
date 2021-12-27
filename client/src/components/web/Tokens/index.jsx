import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab } from 'react-bootstrap';
import { useAutoRefreshEffect } from '../../hooks/useAutoRefreshEffect';
import HeadingModule from '../../Common/Layout/HeadingComponent/Heading';
import { SendReceiveSection } from '../../Common/SendReceive';
import { getMassagedUserDetails, getPublicKey } from '../../../selectors/user';
import {
	fetchTokensInfoWithBalance,
	getTokenInfo,
	addCustomTokenAddressToLocalStorage,
	getTokenAddressFromLocalStorage,
} from '../../../actions/tokensActions';
import { getMassagedTokenData, getTokensAddressList } from '../../../selectors/tokens';
import { MessageModal } from '../../Common/Layout/Modal/MessageModal';
import { AddTokenModal } from '../../Common/Layout/Modal/AddTokenModal';
import { TOKEN_TRANSFER_FEE } from '../../../constants/key';
import { TokenList } from '../../Common/TokenList';
import { TokenInfo } from './TokenInfo';

const Tokens = () => {
	const dispatch = useDispatch();

	// Selector
	const tokensInfo = useSelector(getMassagedTokenData);
	const tokensAddressList = useSelector(getTokensAddressList);
	const userDetails = useSelector(getMassagedUserDetails);
	const publicKey = useSelector(getPublicKey);

	// State
	const [selectedToken, setSelectedToken] = useState({});
	const [showAddTokenModal, setShowAddTokenModal] = useState(false);
	const [addTokenError, setAddTokenError] = useState('');
	const [showError, setShowError] = useState(false);

	// Effect
	useEffect(() => {
		if (publicKey) {
			dispatch(getTokenAddressFromLocalStorage(publicKey));
		}
	}, [publicKey, dispatch]);

	useEffect(() => {
		if (tokensInfo.length) {
			const tokenInfo = tokensInfo.find((token) => token.address === selectedToken.address) || tokensInfo[0];
			setSelectedToken(tokenInfo);
		}
	}, [tokensInfo, selectedToken.address]);

	useAutoRefreshEffect(() => {
		dispatch(fetchTokensInfoWithBalance(tokensAddressList, publicKey));
	}, [publicKey, JSON.stringify(tokensAddressList)]);

	// Functions
	const onTokenClick = (address) => {
		setSelectedToken(tokensInfo.find((token) => token.address === address));
	};

	// Token modal
	const onAddNewTokenAddress = () => {
		if (!publicKey) {
			setShowError(true);
		} else {
			setShowAddTokenModal(true);
		}
	};

	const onCloseTokenModal = () => {
		setShowAddTokenModal(false);
	};

	const handleAddToken = async (tokenAddress) => {
		const { data } = await dispatch(getTokenInfo(tokenAddress));
		if (!data || !data.name) {
			setAddTokenError('Can not find token info');
		} else {
			dispatch(addCustomTokenAddressToLocalStorage(tokenAddress, publicKey));
			setShowAddTokenModal(false);
		}
	};

	return (
		<section className="cd_wallets_page">
			<HeadingModule name={'Tokens'} />
			<div className="cd_add_token_content cd_add_token_row row">
				{!tokensInfo.length ? (
					<div className="cd_currency_column_sub_row no_token_message">You do not have any Tokens yet.</div>
				) : (
					<div className="cd_currency_column_sub_row">
						<TokenList tokensInfo={tokensInfo} selectedToken={selectedToken} onTokenClick={onTokenClick} />
					</div>
				)}
				<div className="cd_add_token_column cd_add_token_btn_col col" onClick={onAddNewTokenAddress}>
					<div className="cd_add_token_btn_content">+ Add Token</div>
				</div>
			</div>
			<TokenInfo selectedToken={selectedToken} />
			<Tab.Content>
				<SendReceiveSection
					tokenSymbol={selectedToken.symbol}
					fromAddress={publicKey}
					displayBalance={selectedToken.balance && selectedToken.balance.displayValue}
					minAmount={0}
					tokenInfo={selectedToken}
					transferFee={TOKEN_TRANSFER_FEE}
					csprBalance={userDetails.balance && userDetails.balance.displayBalance}
				/>
			</Tab.Content>

			<AddTokenModal
				show={showAddTokenModal}
				handleClose={onCloseTokenModal}
				handleAddToken={handleAddToken}
				error={addTokenError}
			/>
			<MessageModal
				type="Error"
				message="Unlock your Signer!"
				show={showError}
				handleClose={() => setShowError(false)}
			/>
		</section>
	);
};

export default Tokens;
