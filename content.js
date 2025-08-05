// Overlay element
let overlay = null;

function createOverlay() {
  if (overlay) return;
  overlay = document.createElement('div');
  overlay.id = 'only-one-page-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.6)';
  overlay.style.zIndex = '2147483647';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.backdropFilter = 'blur(4px)';
  overlay.innerHTML = `<div style="color: white; font-size: 2em; text-align: center; max-width: 90vw;">Only one page is allowed right now.<br>Return to your allowed tab to continue.</div>`;
  document.body.appendChild(overlay);
}

function removeOverlay() {
  if (overlay) {
    overlay.remove();
    overlay = null;
  }
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'showOverlay') {
    createOverlay();
  } else if (msg.action === 'hideOverlay') {
    removeOverlay();
  }
}); 