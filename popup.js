const statusDiv = document.getElementById('status');
const toggleBtn = document.getElementById('toggleBtn');

function updateStatus(active) {
  statusDiv.textContent = active ? 'Only One Page mode is ACTIVE' : 'Mode is OFF';
  toggleBtn.textContent = active ? 'Deactivate' : 'Activate';
}

function getCurrentTabId(cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) cb(tabs[0].id);
    else cb(null);
  });
}

function refresh() {
  chrome.runtime.sendMessage({ action: 'getStatus' }, (resp) => {
    updateStatus(resp.active);
  });
}

toggleBtn.onclick = () => {
  chrome.runtime.sendMessage({ action: 'getStatus' }, (resp) => {
    if (!resp.active) {
      getCurrentTabId((tabId) => {
        chrome.runtime.sendMessage({ action: 'activateOnlyOnePage', tabId }, refresh);
      });
    } else {
      chrome.runtime.sendMessage({ action: 'deactivateOnlyOnePage' }, refresh);
    }
  });
};

document.addEventListener('DOMContentLoaded', refresh); 