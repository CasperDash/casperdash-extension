import browser from 'webextension-polyfill';
import * as Sentry from '@sentry/browser';
import { CONSTANTS } from '@cd/shared/constants';
const MESSAGE_TYPE = 'casperdash-extension';

export default class MessageChannel {
	constructor(options) {
		this.source = options.source;
		this.destination = options.destination;
		this.messageHandler = options.messageHandler;
		this.sendMessage = options.sendMessage;

		browser.runtime.onMessage.addListener(this.onMessage.bind(this));
	}

	onMessage(request, sender) {
		if (request.destination === this.source && request.source === this.destination) {
			let promise;
			try {
				if (CONSTANTS.DEBUG_ENV) {
					console.warn(
						`MessageChannel: (${this.source}): Receiving`,
						JSON.stringify(request.payload, null, '  '),
					);
				}

				const caller = {
					id: sender.id,
					url: sender.url,
				};

				const response = this.messageHandler(request.payload, caller);
				promise = Promise.resolve(response);
			} catch (e) {
				promise = Promise.reject(e);
			}
			return promise
				.then((result) => {
					return {
						destination: request.source,
						payload: result,
						source: request.destination,
						type: MESSAGE_TYPE,
					};
				})
				.catch((error) => {
					Sentry.withScope(function (scope) {
						scope.setTag('messageChannel', 'true');
						Sentry.captureException(error);
					});


					return {
						destination: request.source,
						error: error.message,
						source: request.destination,
						type: MESSAGE_TYPE,
					};
				});
		}
	}
}
