import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { NEWS } from '../store/actionTypes';

export const newSelector = getQuerySelector({ type: NEWS.FETCH_NEWS });

export const getNews = createSelector(newSelector, ({ data }) => {
	return data?.news || [];
});
