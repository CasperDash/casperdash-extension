import registerContentProxy from "@cd/services/ServiceWorker/Provider";

function injectCustomJs() {
    try {
      let jsPath = '/static/js/scripts/content/inpage.js';
      const container = document.head || document.documentElement;
      const scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'text/javascript');
      scriptTag.src = chrome.runtime.getURL(jsPath);
      container.insertBefore(scriptTag, container.children[0]);
      scriptTag.onload = function () {
        // remove after run the script
        container.removeChild(scriptTag);
        chrome.runtime.onMessage.addListener((data) => {
          const event = new CustomEvent(`signer:${data.name}`, {
            detail: data.detail
          });
          window.dispatchEvent(event);
        });
      };
    } catch (e) {
      console.error('CasperLabs provider injection failed.', e);
    }
}

injectCustomJs();
registerContentProxy();