import createAsyncSelector from 'async-selector';
import { createSelector } from 'reselect';
import store from '../store';

function rerender(data, id = '') {
	store.dispatch({
		type: 'RERENDER_APP',
		key: id,
		value: data,
	});
}

function rerenderError(error, id = '') {
	store.dispatch({
		type: 'RERENDER_APP',
		key: id,
		value: String(error),
	});
}

export function createCustomAsyncSelector(params, ...selectors) {
	return createAsyncSelector(
		{
			onResolve: (result) => rerender(result, params.id),
			onReject: (error) => rerenderError(error, params.id),
			...params,
		},
		...selectors,
	);
}

export function getAsyncSelectorResult(params, selector) {
	const customSelector = createCustomAsyncSelector(params, selector);
	return [
		createSelector([customSelector], (d) => (d.isResolved ? d.value : {})),
		createSelector([customSelector], (d) => d.isWaiting),
		createSelector([customSelector], (d) => (d.isRejected ? String(d.value) : null)),
	];
}
