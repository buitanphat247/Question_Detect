// =========================================================================
// GOOGLE TRANSLATE DISGUISED POPUP CONTROLLER
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const btnContinuous = document.getElementById('btnContinuous');
  const btnSingle = document.getElementById('btnSingle');
  const btnSnip = document.getElementById('btnSnip');

  const inputApiKey = document.getElementById('inputApiKey');
  const btnToggleKey = document.getElementById('btnToggleKey');
  const btnSaveKey = document.getElementById('btnSaveKey');
  const keyStatusBadge = document.getElementById('keyStatusBadge');
  const keyNotice = document.getElementById('keyNotice');

  // Load existing API Key from storage
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.get(['key4uApiKey'], (res) => {
      const key = res?.key4uApiKey || '';
      if (inputApiKey) inputApiKey.value = key;
      updateKeyUI(key);
    });
  }

  function updateKeyUI(key) {
    if (!keyStatusBadge || !keyNotice) return;
    if (key && key.trim().length > 0) {
      keyStatusBadge.className = 'gt-badge-ok';
      keyStatusBadge.textContent = 'Đã có Key';
      keyNotice.textContent = 'Key đã sẵn sàng! Bấm phím N hoặc Alt + K để giải.';
      keyNotice.style.color = '#15803d';
    } else {
      keyStatusBadge.className = 'gt-badge-warn';
      keyStatusBadge.textContent = 'Chưa có Key';
      keyNotice.textContent = 'Nhập Key để kích hoạt phím N và Alt + K.';
      keyNotice.style.color = '#b45309';
    }
  }

  // Toggle ẩn/hiện Key
  if (btnToggleKey && inputApiKey) {
    btnToggleKey.addEventListener('click', () => {
      const isPassword = inputApiKey.type === 'password';
      inputApiKey.type = isPassword ? 'text' : 'password';
      btnToggleKey.textContent = isPassword ? '🔒' : '👁️';
    });
  }

  // Lưu Key vào chrome.storage.local
  function saveApiKey() {
    if (!inputApiKey) return;
    const key = inputApiKey.value.trim();
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ key4uApiKey: key }, () => {
        updateKeyUI(key);
        if (btnSaveKey) {
          btnSaveKey.classList.add('saved');
          btnSaveKey.textContent = 'Đã lưu ✓';
          setTimeout(() => {
            btnSaveKey.classList.remove('saved');
            btnSaveKey.textContent = 'Lưu';
          }, 1500);
        }
      });
    }
  }

  if (btnSaveKey) {
    btnSaveKey.addEventListener('click', saveApiKey);
  }

  if (inputApiKey) {
    inputApiKey.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveApiKey();
      }
    });
  }

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
