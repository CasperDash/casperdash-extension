import { getMutationSelector } from '@redux-requests/core';
import { DEPLOY } from '../store/actionTypes';

export const deploySelector = getMutationSelector({ type: DEPLOY.PUT_DEPLOY });
