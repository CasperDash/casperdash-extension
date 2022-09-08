import MessageChannel from './MessageChannel';

export default class RPC {
	constructor(options) {
		this.methods = new Map();
		this.messageChannel = new MessageChannel({ ...options, messageHandler: this.messageHandler.bind(this) });
	}

	messageHandler(payload, caller) {
		const method = this.methods.get(payload.methodName);

		if (method === undefined) {
			throw new Error('Unregistered method call: ' + payload.methodName);
		}
		return method(payload.params, caller);
	}

	register(name, method) {
		this.methods.set(name, method);
	}
}
