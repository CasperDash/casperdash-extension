import React, { useState, useEffect, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { approveSignDeployRequest, parseSignDeployData, rejectSignDeployRequest } from '@cd/components/hooks/useServiceWorker';
import { withServiceWorkerRequired } from '@cd/components/hocs/ServiceWorkerRequired';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText';
import { withDappConnectorRequired } from '@cd/components/hocs/DappConnectorRequired/index';
import Divider from '@cd/components/Common/Divider';
import { moteToCspr } from '@cd/helpers/balance';
import { getExplorer } from '@cd/selectors/settings';
import DeployField from './DeployField';

import './index.scss';


const DappSignDeployRequest = () => {
	const explorerUrl = useSelector(getExplorer);
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

	const params = useMemo(() => {
		return [
			{
				name: 'deployHash',
				label: 'Deploy Hash',
				value: deployData.deployHash,
				link: `${explorerUrl}/deploy/${deployData.deployHash}`,
			},
			{
				name: 'account',
				label: 'Account',
				value: deployData.account,
				link: `${explorerUrl}/account/${deployData.account}`,
			},
			{
				name: 'contractHash',
				label: 'Contract Hash',
				value: deployData.contractHash,
				link: `${explorerUrl}/account/${deployData.contractHash}`,
			},
			{
				name: 'timestamp',
				label: 'Timestamp',
				value: deployData.timestamp,
			},
			{
				name: 'payment',
				label: 'Payment',
				value: deployData.payment,
				tooltip: (
					<span>
						{moteToCspr(deployData.payment)} CSPR
					</span>
				)
			},
			{
				name: 'deployType',
				label: 'Deploy Type',
				value: deployData.deployType,
			}
		]
	}, [deployData.account, deployData.contractHash, deployData.deployHash, deployData.deployType, deployData.payment, deployData.timestamp, explorerUrl]);

	return (
		<div className="cd_we_sign_deploy_container">
			<div>
				<h1>Signature Deploy Request</h1>
			</div>
			<div className="cd_we_sign_deploy_list_fields">
				{
					params.map((param) => {
						if (!param.value) {
							return null;
						}

						return (
							<div key={`deploy-field-${param.name}`} className="cd_we_sign_deploy_field">
								<span>{param.label}</span>
								<div className="long_text">
									{
										param.link ? (
											<a href={param.link} target="_blank" rel="noopener noreferrer">
												<MiddleTruncatedText end={4}>{param.value}</MiddleTruncatedText>
											</a>
										) : (
											<MiddleTruncatedText end={4}>{param.value}</MiddleTruncatedText>											)
									}
								</div>
							</div>
						)
					})
				}
					{deployData.deployArgs && (
						<>
							<Divider className="cd_we_sign_divider" color="#000000" />
							<div className="cd_we_sign_deploy_args">
								{Object.keys(deployData.deployArgs).map((argKey) => {
									return <DeployField key={argKey} name={argKey} value={deployData.deployArgs[argKey]} />;
								})}
							</div>
						</>
					)}
			</div>
			<div className="cd_we_sign_deploy_actions">
				<Button variant="secondary" onClick={onCancel}>
					Reject
				</Button>
				<Button variant="primary" onClick={onOk}>
					Approve
				</Button>
			</div>
		</div>
	);
};

export default withDappConnectorRequired(
	withServiceWorkerRequired(DappSignDeployRequest)
);
