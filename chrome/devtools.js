// devtools.js

// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
  name: "devtools-page",
});

// backgroundPageConnection.postMessage({
//     name: 'init',
//     tabId: chrome.devtools.inspectedWindow.tabId
// });

var count = 0;

chrome.devtools.network.onRequestFinished.addListener((request) => {
  count++;

  request.getContent((body) => {
    if (request.request && request.request.url) {
      const params = new Proxy(new URLSearchParams(request.request.url), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      if (
        request.request.url.includes(
          "https://knowledgedb-api.elmorelab.com/database/getNpc?"
        )
      ) {
        backgroundPageConnection.postMessage({
          name: "getNpc",
          data: JSON.parse(body),
          tabId: chrome.devtools.inspectedWindow.tabId,
        });
      }
      if (
        request.request.url.includes(
          "https://knowledgedb-api.elmorelab.com/database/getNpcDetail?"
        )
      ) {
        backgroundPageConnection.postMessage({
          name: "getNpcDetail",
          data: JSON.parse(body),
          tabId: chrome.devtools.inspectedWindow.tabId,
          npcId: params.npcId,
        });
      }
      if (
        request.request.url.includes(
          "https://knowledgedb-api.elmorelab.com/database/getMap?"
        )
      ) {
        backgroundPageConnection.postMessage({
          name: "getMap",
          data: JSON.parse(body),
          tabId: chrome.devtools.inspectedWindow.tabId,
          npcId: params.npcId,
        });
      }
    }
  });
});

//update tab
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    backgroundPageConnection.postMessage({
      name: "tabOnUpdated",
      tabId: tabId,
      status: changeInfo.status,
    });
  }
  // if (request.request.url.includes('https://knowledgedb-api.elmorelab.com/database/getNpcDetail')) {
  //   chrome.tabs.reload(tabId)
  // }
});
