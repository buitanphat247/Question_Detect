// =========================================================================
// GOOGLE TRANSLATE DISGUISED POPUP CONTROLLER
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const btnContinuous = document.getElementById('btnContinuous');
  const btnSingle = document.getElementById('btnSingle');
  const btnSnip = document.getElementById('btnSnip');

  if (btnContinuous) {
    btnContinuous.addEventListener('click', async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.id) {
          chrome.tabs.sendMessage(tab.id, { action: 'TRIGGER_CONTINUOUS_SOLVE' }, () => {});
        }
      } catch (e) {}
      window.close();
    });
  }

  if (btnSingle) {
    btnSingle.addEventListener('click', async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.id) {
          chrome.tabs.sendMessage(tab.id, { action: 'TRIGGER_SINGLE_SOLVE' }, () => {});
        }
      } catch (e) {}
      window.close();
    });
  }

  if (btnSnip) {
    btnSnip.addEventListener('click', async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.id) {
          chrome.tabs.sendMessage(tab.id, { action: 'START_STEALTH_SNIP' }, () => {});
        }
      } catch (e) {}
      window.close();
    });
  }
});
