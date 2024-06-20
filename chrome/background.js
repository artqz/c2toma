// background.js
console.log(Date.now());
const VERSION = "c1"

//content_scripts
// chrome.runtime.onConnect.addListener(function (port) {
//   if (port.name == "content-scripts-page") {
//     console.log("content-scripts-page");
//   }
// });

var openCount = 0;
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name == "devtools-page") {
    if (openCount == 0) {
      console.log("DevTools window opening.");
    }
    openCount++;

    port.onDisconnect.addListener(function (port) {
      openCount--;
      if (openCount == 0) {
        console.log("Last DevTools window closing.");
      }
    });
  }
});

const tabData = new Map();

chrome.runtime.onConnect.addListener(async function (port) {
  var extensionListener = async function (message, sender, sendResponse) {
    // The original connection event doesn't include the tab ID of the
    // DevTools page, so we need to send it explicitly.

    if (message.name == "tabOnUpdated") {
      console.log("tabOnUpdated", message);
      tabData.set(message.tabId, { getNpcDetail: false, getMap: false });
    }

    if (message.name == "getNpc") {
      try {
        const res = await fetch("http://localhost:3000/setNpc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: message.data,
            v: VERSION,
          }),
        });
        await nextNpc(message.tabId);
      } catch (e) {}
    }

    if (message.name == "getNpcDetail") {
      if (!tabData.has(message.tabId)) {
        return;
      } else {
        //save
        try {
          if ("status" in message.data) {
            if (message.data.status == "404") {
              console.log(`[error]: 404, npcId: ${message.npcId}`);
              return;
            }
          }
          const res = await fetch("http://localhost:3000/setNpcDetail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: message.data,
              npcId: message.npcId,
              v: VERSION,
            }),
          });
          if (res.ok) {
            const newMap = tabData.get(message.tabId);
            newMap.getNpcDetail = message.data != null ? true : false;
            tabData.set(message.tabId, newMap);
            console.log(`[success]: npcDetail`);
          } else {
            console.log(`[fail]: need update TAB`);
          }
        } catch (e) {
          console.log(`[fail]: need update TAB`);
        }
      }
    }

    if (message.name == "getMap") {
      if (!tabData.has(message.tabId)) {
        return;
      } else {
        //save
        try {
          if ("status" in message.data) {
            if (message.data.status == "404") {
              console.log(`[error]: 404, npcId: ${message.npcId}`);
              return;
            }
          }
          const res = await fetch("http://localhost:3000/setMap", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: message.data,
              npcId: message.npcId,
              v: VERSION,
            }),
          });
          if (res.ok) {
            const newMap = tabData.get(message.tabId);
            newMap.getMap = message.data != null && message.data.hasOwnProperty('map') ? true : false;
            tabData.set(message.tabId, newMap);
            console.log(`[success]: npcMap`);
          } else {
            console.log(`[fail]: need update TAB`);
          }
        } catch (e) {
          console.log(`[fail]: need update TAB`);
        }
      }
    }

    if (tabData.has(message.tabId)) {
      const tab = tabData.get(message.tabId);
      if (tab.getNpcDetail && tab.getMap) {
        await nextNpc(message.tabId);
      }
    }
  };

  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(extensionListener);

  port.onDisconnect.addListener(function (port) {
    port.onMessage.removeListener(extensionListener);

    tabData.clear();
  });
});

//
async function nextNpc(tabId) {
  try {
    const res = await fetch("http://localhost:3000/nextNpc", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    setTimeout(() => {
      console.log(`redirect npcId: ${json.npcId} v: ${json.v}`);
    // chrome.tabs.update(
    //   tabId,
    //   {
    //     url: `https://knowledgedb.elmorelab.com/#/npc/npcDetail/${json.npcId}?chronicle=${json.v}`,
    //   },
    //   () => {
    //     chrome.tabs.update(tabId, {
    //       url: `https://knowledgedb.elmorelab.com/#/npc/npcDetail/${json.npcId}?chronicle=${json.v}`,
    //     });
    //   }
    // );
    chrome.tabs.create(
      {
        url: `https://knowledgedb.elmorelab.com/#/npc/npcDetail/${json.npcId}?chronicle=${json.v}`,
      },
      () => {
        chrome.tabs.remove(tabId);
      }
    );
    }, 2000)
    
  } catch (e) {
    console.log(`[fail]: need update TAB 20s`);
    setTimeout(() => {
    chrome.tabs.reload(tabId)
    }, 20000)
  }
}
