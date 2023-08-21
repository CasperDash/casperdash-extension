import { SendReceive } from '@cd/web-extension/Common/SendReceiveButtons';
import React from 'react';
import { useTokenInfo } from '@cd/hooks/useTokensInfo';

const SendAndReceiveButton = () => {
	const { allTokenInfo } = useTokenInfo();

	return (
		<SendReceive token={allTokenInfo.find((token) => token.address === 'CSPR')} />
	)
}

export default SendAndReceiveButton;
