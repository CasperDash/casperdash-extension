import { getQuerySelector } from '@redux-requests/core';
import { KEY_MANAGER } from '../store/actionTypes';

export const keyManagerDetailsSelector = getQuerySelector({ type: KEY_MANAGER.FETCH_KEY_MANAGER_DETAILS });
