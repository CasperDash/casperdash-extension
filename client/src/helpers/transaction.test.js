import { getTransactionIcon, enrichTransactionWithIcon } from './transaction';

test('should return receive icon', () => {
	expect(getTransactionIcon('receive')).toEqual('assets/images/receive-icon-small.svg');
});

test('should return send icon', () => {
	expect(getTransactionIcon('send')).toEqual('assets/images/send-icon-small.svg');
	expect(getTransactionIcon()).toEqual('assets/images/send-icon-small.svg');
});
test('enrichTransactionWithIcon', () => {
	expect(enrichTransactionWithIcon([{ type: 'receive', symbol: 'CSPR' }])).toEqual([
		{ icon: 'assets/images/receive-icon-small.svg', symbol: 'CSPR', type: 'receive' },
	]);
});
