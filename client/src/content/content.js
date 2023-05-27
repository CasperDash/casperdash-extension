import registerContentProxy from "@cd/services/ServiceWorker/Provider";

function injectCustomJs() {
    try {
      const jsPath = '/static/js/scripts/content/inpage.js';
      const container = document.head || document.documentElement;
      const scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'text/javascript');
      scriptTag.src = chrome.runtime.getURL(jsPath);
      container.insertBefore(scriptTag, container.children[0]);
      scriptTag.onload = function () {
        // Remove after run the script, because our script loaded and we don't need to show it on DOM.
        container.removeChild(scriptTag);
        chrome.runtime.onMessage.addListener((data) => {
          const event = new CustomEvent(`casperdash:${data.name}`, {
            detail: data.detail
          });
          window.dispatchEvent(event);
        });
      };
    } catch (e) {
      console.error('Caserdash provider injection failed.', e);
    }
}

injectCustomJs();
registerContentProxy();