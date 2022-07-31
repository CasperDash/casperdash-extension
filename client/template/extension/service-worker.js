console.log("This prints to the console of the service worker (background script) 222");
// chrome.storage.onChanged.addListener(function (changes, namespace) {
//   console.log(`🚀 ~ changes`, changes)
//   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//     console.log(
//       `Storage key "${key}" in namespace "${namespace}" changed.`,
//       `Old value was "${oldValue}", new value is "${newValue}".`
//     );
//   }
// });

// chrome.storage.local.get(['key'], function(result) {
//   console.log('>>>> Value currently is :', result);
// });
