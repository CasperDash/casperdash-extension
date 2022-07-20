import { ValidatorUtils } from 'casper-storage';


const isStrongPassword = (password) => ValidatorUtils.verifyStrongPassword(password)?.status ?? false;

export { isStrongPassword };
