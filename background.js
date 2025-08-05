// Global state
let onlyOnePageActive = false;
let allowedTabId = null;

// Helper: inject or remove overlay in all tabs except allowed
async function updateTabOverlays() {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.id || tab.url?.startsWith('chrome://')) continue;
    if (onlyOnePageActive && tab.id !== allowedTabId) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(tab.id, { action: 'showOverlay' });
      });
    } else {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(tab.id, { action: 'hideOverlay' });
      });
    }
  }
}

// Listen for popup toggle
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'activateOnlyOnePage') {
    onlyOnePageActive = true;
    allowedTabId = msg.tabId;
    updateTabOverlays();
    sendResponse({ success: true });
  } else if (msg.action === 'deactivateOnlyOnePage') {
    onlyOnePageActive = false;
    allowedTabId = null;
    updateTabOverlays();
    sendResponse({ success: true });
  } else if (msg.action === 'getStatus') {
    sendResponse({ active: onlyOnePageActive, allowedTabId });
  }
  return true;
});

// Tab events: update overlays as needed
chrome.tabs.onActivated.addListener(() => {
  if (onlyOnePageActive) updateTabOverlays();
});
chrome.tabs.onCreated.addListener(() => {
  if (onlyOnePageActive) updateTabOverlays();
});
chrome.tabs.onUpdated.addListener(() => {
  if (onlyOnePageActive) updateTabOverlays();
});
chrome.tabs.onRemoved.addListener((tabId) => {
  if (onlyOnePageActive && tabId === allowedTabId) {
    // Allowed tab closed: deactivate mode
    onlyOnePageActive = false;
    allowedTabId = null;
    updateTabOverlays();
  }
});

// On extension startup, reset state
chrome.runtime.onStartup.addListener(() => {
  onlyOnePageActive = false;
  allowedTabId = null;
}); 