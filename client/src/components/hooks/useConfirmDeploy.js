import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { putDeploy } from '../../actions/deployActions';
import useSigner from './useSigner';

//This hook is using for toasting message during deploy progress
export const useConfirmDeploy = () => {
	const [isDeploying, setIsDeploying] = useState(false);
	const [isError, setDeployError] = useState(false);

	const dispatch = useDispatch();
	const signer = useSigner();

	const putSignedDeploy = async (signedDeploy) => {
		const { data: hash, error } = await dispatch(putDeploy(signedDeploy));
		if (error) {
			throw error;
		}
		return hash.deployHash;
	};

	const executeDeploy = async (buildDeployFn, fromPublicKey, toPublicKey) => {
		setIsDeploying(true);
		const toastId = toast.loading('Preparing deploy');
		try {
			const deploy = await buildDeployFn();
      console.log(`🚀 ~ executeDeploy ~ deploy`, deploy)
			// Sign with signer
			toast.update(toastId, { render: 'Please review the deploy' });
      console.log(`🚀 ~ file: useConfirmDeploy.js ~ line 32 ~ executeDeploy ~ signer`, signer)
			const signedDeploy = await signer.sign(deploy, fromPublicKey, toPublicKey);
      console.log(`🚀 ~ file: useConfirmDeploy.js ~ line 33 ~ executeDeploy ~ signedDeploy`, signedDeploy)
			// Put deploy on chain
			toast.update(toastId, { render: 'Putting deploy' });
			const deployHash = await putSignedDeploy(signedDeploy);
			toast.update(toastId, {
				render: `Deploy hash: ${deployHash}`,
				type: 'success',
				isLoading: false,
				autoClose: 5000,
			});
			setIsDeploying(false);
			return { deployHash, signedDeploy };
		} catch (error) {
      console.log(`🚀 ~ ERRROR >>>>>> `, error)
			toast.update(toastId, {
				render: error.message,
				type: 'error',
				isLoading: false,
				autoClose: 5000,
			});
			setDeployError(true);
			setIsDeploying(false);
			return {};
		}
	};

	return { executeDeploy, isDeploying, isError };
};
