import createAsyncSelector from 'async-selector';
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
