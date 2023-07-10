import * as shareableSeed from 'casper-shareable-seed';
import _values from 'lodash-es/values';

export const mnemonicToShares = (mnemonic) => {
    return shareableSeed.mnemonicToShares(mnemonic, 3, 2, 'v1', 'english');
};

export const sharesToMnemonic = (shares) => {
    const shareList = _values(shares).slice(0, 2);

    return shareableSeed.shareListToMnemonic(shareList) || '';
};