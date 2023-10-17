import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { CLPublicKey } from 'casper-js-sdk';
import _get from 'lodash-es/get';
import { getPublicKey } from '@cd/selectors/user';
import { TOKEN_STANDARDS } from '@cd/constants/tokenStandards';
import { useConfirmDeploy } from '@cd/components/hooks/useConfirmDeploy';
import { getContractPackageInfo } from '@cd/actions/tokensActions';
import { getNetwork } from '@cd/selectors/settings';
import { DeployStatus } from '@cd/constants/deployStatus';
import { MAP_WASM, transferCEP47, transferCEP78 } from '../utils/nft';
import { useAddNFTHistory } from './useAddNFTHistory';

export const useSendNFT = (options = {}) => {
	const publicKey = useSelector(getPublicKey);
  const { executeDeploy } = useConfirmDeploy();
  const { addNFTHistoryAsync } = useAddNFTHistory();
  const dispatch = useDispatch();
  const network = useSelector(getNetwork);

  const mutation = useMutation({
    ...options,
    mutationFn: async ({
      tokenStandardId,
      toPublicKeyHex,
      tokenId,
      paymentAmount,
      isUsingSessionCode,
      wasmName,
      name,
      image,
      contractAddress,
    }) => {

      let buildDeployFn;
      const clFromPublicKey = CLPublicKey.fromHex(publicKey);
      const clToPublicKey = CLPublicKey.fromHex(toPublicKeyHex);

      const { data } = await dispatch(getContractPackageInfo(contractAddress));
      const { contract_hash: contractHash } = data;
      if (!contractHash) {
        throw new Error('Invalid contract hash');
      }

      switch (tokenStandardId) {
        case TOKEN_STANDARDS.CEP78: {
          let wasm;
          if (isUsingSessionCode) {
            if (!wasmName || !MAP_WASM[wasmName]) {
              throw new Error('Invalid wasm name');
            }

            wasm = MAP_WASM[wasmName];
          }

          buildDeployFn = () => {
            return transferCEP78(
              {
                tokenId: tokenId.toString(),
                source: clFromPublicKey,
                target: clToPublicKey,
                contractHash: `hash-${contractHash}`,
              },
              {
                useSessionCode: !!isUsingSessionCode,
              },
              paymentAmount.toString(),
              clFromPublicKey,
              network,
              wasm,
            );
          };

          break;
        }
        case TOKEN_STANDARDS.CEP47: {
          buildDeployFn = () => {
            return transferCEP47(
              clToPublicKey,
              clFromPublicKey,
              [tokenId.toString()],
              `hash-${contractHash}`,
              paymentAmount.toString(),
              clFromPublicKey,
              network
            );
          };

          break;
        }
        default:
          throw new Error('Invalid contract type');
      }

      const { deployHash, signedDeploy } = await executeDeploy(buildDeployFn, publicKey, toPublicKeyHex);
      if (!deployHash) {
        throw new Error('Deploy hash is null');
      }

      await addNFTHistoryAsync({
        fromPublicKeyHex: publicKey,
        name,
        contractAddress,
        contractHash: contractHash,
        tokenId: tokenId.toString(),
        toPublicKeyHex,
        tokenStandardId,
        status: DeployStatus.PENDING,
        paymentAmount: paymentAmount.toString(),
        image,
        deployHash: deployHash,
        timestamp: _get(signedDeploy, 'deploy.header.timestamp'),
      });

      return { deployHash, signedDeploy, contractHash };
    },
    onSuccess: async (data, variable, context) => {
      options?.onSuccess?.(data, variable, context);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isLoading,
    send: mutation.mutate,
    sendAsync: mutation.mutateAsync,
  };
};
