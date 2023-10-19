import { CLValueBuilder, RuntimeArgs } from 'casper-js-sdk';
import { callEntrypoint, callSessionWasm } from '@cd/services/casperServices';
import TransferCallWasm from '../wasm/transfer_call.wasm';

const ERRORS = {
  CONFLICT_CONFIG: 'Conflicting arguments provided',
}

export const MAP_WASM = {
  transfer_call: TransferCallWasm,
};

const convertHashStrToHashBuff = (hashStr) => {
  let hashHex = hashStr;
  if (hashStr.startsWith('hash-')) {
    hashHex = hashStr.slice(5);
  }
  return Buffer.from(hashHex, 'hex');
};

export const transferCEP78 = (
  args,
  config,
  paymentAmount,
  deploySender,
  network,
  wasm,
) => {
  const { contractHash } = args;
  const contractHashKey = CLValueBuilder.key(CLValueBuilder.byteArray(convertHashStrToHashBuff(contractHash)));

  if (config.useSessionCode === false && !!wasm) throw new Error(ERRORS.CONFLICT_CONFIG);

  const runtimeArgs = RuntimeArgs.fromMap({
    target_key: CLValueBuilder.key(args.target),
    source_key: CLValueBuilder.key(args.source),
  });

  if (args.tokenId) {
    runtimeArgs.insert('is_hash_identifier_mode', CLValueBuilder.bool(false));
    runtimeArgs.insert('token_id', CLValueBuilder.u64(args.tokenId));
  }

  if (args.tokenHash) {
    runtimeArgs.insert('is_hash_identifier_mode', CLValueBuilder.bool(true));
    runtimeArgs.insert('token_id', CLValueBuilder.u64(args.tokenHash));
  }

  if (config.useSessionCode) {
    if (!wasm) {
      throw new Error('Missing wasm argument');
    }
    if (!contractHashKey) {
      throw new Error('Missing contractHashKey argument');
    }
    runtimeArgs.insert('nft_contract_hash', contractHashKey);
    const wasmToCall = wasm;

    const preparedDeploy = callSessionWasm(wasmToCall, runtimeArgs, paymentAmount, deploySender, network);

    return preparedDeploy;
  }

  const preparedDeploy = callEntrypoint(
    'transfer',
    runtimeArgs,
    deploySender,
    network,
    paymentAmount,
    contractHash,
  );

  return preparedDeploy;
};

export const transferCEP47 = (
  recipient,
  owner,
  ids,
  contractHash,
  paymentAmount,
  deploySender,
  network
) => {
  const runtimeArgs = RuntimeArgs.fromMap({
    recipient: CLValueBuilder.key(recipient),
    sender: CLValueBuilder.key(owner),
    token_ids: CLValueBuilder.list(ids.map((id) => CLValueBuilder.u256(id))),
  });

  return callEntrypoint('transfer_from', runtimeArgs, deploySender, network, paymentAmount, contractHash);
};
