import React, { useState, useEffect } from 'react';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { approveSignDeployRequest, parseSignDeployData, rejectSignDeployRequest } from '@cd/components/hooks/useServiceWorker';
import { withServiceWorkerRequired } from '@cd/components/hocs/ServiceWorkerRequired';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText';
import { withDappConnectorRequired } from '@cd/components/hocs/DappConnectorRequired/index';
import Divider from '@cd/components/Common/Divider';
import { moteToCspr } from '@cd/helpers/balance';
import DeployField from './DeployField';

import './index.scss';

const DappSignDeployRequest = () => {
	const [deployData, setDeployData] = useState({});

	useEffect(() => {
		const loadDeployData = async () => {
			const deployData = await parseSignDeployData();

			setDeployData(deployData);
		};

		loadDeployData();
	}, []);

	const onOk = async () => {
		try {
			await approveSignDeployRequest();
		} catch (err) {
			// eslint-disable-next-line no-console
			console.log(err);
		}
	};

	const onCancel = () => {
		rejectSignDeployRequest();
	};

	return (
		<div className="cd_we_sign_deploy_container">
			<div>
				<h1>Signature Deploy Request</h1>
			</div>
			<div className="cd_we_sign_deploy_list_fields">
				<div className="cd_we_sign_deploy_field">
					<span>Deploy Hash</span>
					<div className="long_text">
						<MiddleTruncatedText end={4}>{deployData.deployHash}</MiddleTruncatedText>
					</div>
				</div>
				<div className="cd_we_sign_deploy_field">
					<span>Account</span>
					<div className="long_text">
						<MiddleTruncatedText end={4}>{deployData.account}</MiddleTruncatedText>
					</div>
				</div>
				<div className="cd_we_sign_deploy_field">
					<span>Timestamp</span>
					<span>{deployData.timestamp}</span>
				</div>
				<div className="cd_we_sign_deploy_field">
					<span>Payment</span>
					<span>
					<OverlayTrigger
						placement="auto"
						overlay={
							<Tooltip>
								<span>
								{moteToCspr(deployData.payment)} CSPR
								</span>
							</Tooltip>
						}
					>
						<span>
							{deployData.payment}
						</span>
					</OverlayTrigger>
					</span>
				</div>
				<div className="cd_we_sign_deploy_field">
					<span>Deploy Type</span>
					<span>{deployData.deployType}</span>
				</div>
				{deployData.deployArgs && (
					<>
						<Divider className="divider" />
						{Object.keys(deployData.deployArgs).map((argKey) => {
							return <DeployField key={argKey} name={argKey} value={deployData.deployArgs[argKey]} />;
						})}
					</>
				)}
			</div>
			<div className="cd_we_sign_deploy_actions">
				<Button variant="primary" onClick={onOk}>
					Approve
				</Button>

				<Button variant="secondary" onClick={onCancel}>
					Reject
				</Button>
			</div>
		</div>
	);
};

export default withDappConnectorRequired(
	withServiceWorkerRequired(DappSignDeployRequest)
);
