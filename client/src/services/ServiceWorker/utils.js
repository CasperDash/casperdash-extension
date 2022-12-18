import {
    encodeBase16,
    CLTypeTag,
    CLValue,
    CLAccountHash
} from 'casper-js-sdk';

export async function updateStatusEvent(tabId, msg, {
    isUnlocked,
    isConnected,
    activeKey,
}) {
    chrome.tabs.sendMessage(tabId, {
        name: msg,
        detail: {
          isUnlocked,
          isConnected,
          activeKey,
        }
    });
}


export function getDeployPayment(deploy) {
    return deploy.payment.moduleBytes.getArgByName('amount')
        .value()
        .toString()
}

export function getDeployType(deploy) {
    return deploy.isTransfer()
        ? 'Transfer'
        : deploy.session.isModuleBytes()
        ? 'WASM-Based Deploy'
        : deploy.session.isStoredContractByHash() ||
          deploy.session.isStoredContractByName()
        ? 'Contract Call'
        : 'Contract Package Call';
}

export function getDeployArgs(deploy, targetKey) {
    let deployArgs = {};
    
    if (deploy.session.transfer) {
      deployArgs = this.parseTransferData(
        deploy.session.transfer,
        targetKey
      );
  
      return deployArgs;
    }
    
    if (deploy.session.moduleBytes) {
      deploy.session.moduleBytes.args.args.forEach(
        (argument, key) => {
          deployArgs[key] = parseDeployArg(argument);
        }
      );
      deployArgs['module_bytes'] =
        deploy.session.moduleBytes.moduleBytes.toString();
  
      return deployArgs;
    }
  
    let storedContract = getStoredContracts(deploy);
      storedContract.args.args.forEach((argument, key) => {
          deployArgs[key] = parseDeployArg(argument);
      });
      deployArgs['entry_point'] = storedContract.entryPoint;

    return deployArgs;
}

// eslint-disable-next-line complexity
export function parseDeployArg(arg) {
    if (!(arg instanceof CLValue)) {
      throw new Error('Argument should be a CLValue, received: ' + typeof arg);
    }
    const tag = arg.clType().tag;
    switch (tag) {
      case CLTypeTag.Unit:
        return String('CLValue Unit');

      case CLTypeTag.Key: {
        const key = arg;
        if (key.isAccount()) {
          return parseDeployArg(key.value());
        }
        if (key.isURef()) {
          return parseDeployArg(key.value());
        }
        if (key.isHash()) {
          return parseDeployArg(key.value());
        }
        throw new Error('Failed to parse key argument');
      }

      case CLTypeTag.URef:
        return (arg).toFormattedStr();

      case CLTypeTag.Option: {
        const option = arg;
        if (option.isSome()) {
          return parseDeployArg(option.value().unwrap());
        } else {
          const optionValue = option.value().toString();
          const optionCLType = option.clType().toString().split(' ')[1];
          return `${optionValue} ${optionCLType}`;
        }
      }

      case CLTypeTag.List: {
        const list = (arg).value();
        const parsedList = list.map(member => {
          return this.sanitiseNestedLists(member);
        });
        return parsedList;
      }

      case CLTypeTag.ByteArray: {
        const bytes = (arg).value();
        return encodeBase16(bytes);
      }

      case CLTypeTag.Result: {
        const result = arg;
        const status = result.isOk() ? 'OK:' : 'ERR:';
        const parsed = parseDeployArg(result.value().val);
        return `${status} ${parsed}`;
      }

      case CLTypeTag.Map: {
        const map = arg;
        return map.value().toString();
      }

      case CLTypeTag.Tuple1: {
        const tupleOne = arg;
        return parseDeployArg(tupleOne.value()[0]);
      }

      case CLTypeTag.Tuple2: {
        const tupleTwo = arg;
        const parsedTupleTwo = tupleTwo.value().map(member => {
          return this.sanitiseNestedLists(member);
        });
        return parsedTupleTwo;
      }

      case CLTypeTag.Tuple3: {
        const tupleThree = arg;
        const parsedTupleThree = tupleThree.value().map(member => {
          return this.sanitiseNestedLists(member);
        });
        return parsedTupleThree;
      }

      case CLTypeTag.PublicKey:
        return arg.toHex();

      default:
        if (arg instanceof CLAccountHash) {
            return encodeBase16(arg.value());
        }
          
        return arg.value().toString();
    }
  }


export function getStoredContracts(deploy) {
  if (deploy.session.storedContractByHash) {
    return deploy.session.storedContractByHash;
  } 
  
  if (deploy.session.storedContractByName) {
    return deploy.session.storedContractByName;
  } 
  
  if (deploy.session.storedVersionedContractByHash) {
    return deploy.session.storedVersionedContractByHash;
  } 
  
  if (deploy.session.storedVersionedContractByName) {
    return deploy.session.storedVersionedContractByName;
  }

  throw new Error(`Can not parse stored contract: ${deploy.session}`);
}