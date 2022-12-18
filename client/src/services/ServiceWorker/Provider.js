import browser from 'webextension-polyfill';

function registerContentProxy(logMessages = false) {
    window.addEventListener('message', receiveMessage, false);
    async function receiveMessage(event) {
      if (event.origin !== window.location.origin) {
        return;
      }
      
      const msg = event.data;
      if (logMessages) {
        // eslint-disable-next-line no-console
        console.log('receive message', msg);
      }

      if (typeof msg !== 'object') {
        return;
      }
      if (msg.type !== 'casperdash-extension') {
        return;
      }

      msg.value = await browser.runtime.sendMessage(msg);
      msg.type = 'reply';
      window.postMessage(msg, window.location.origin);

      return msg.value;
    }
}

export default registerContentProxy;