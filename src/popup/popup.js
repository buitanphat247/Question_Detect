// =========================================================================
// GOOGLE TRANSLATE DISGUISED POPUP CONTROLLER
// =========================================================================

document.addEventListener('DOMContentLoaded', async () => {
  const loginSection = document.getElementById('loginSection');
  const userSection = document.getElementById('userSection');
  const studentIdInput = document.getElementById('studentIdInput');
  const btnLogin = document.getElementById('btnLogin');
  const btnLogout = document.getElementById('btnLogout');
  const btnContinuous = document.getElementById('btnContinuous');
  const btnSingle = document.getElementById('btnSingle');
  const btnSnip = document.getElementById('btnSnip');
  const loginSpinner = document.getElementById('loginSpinner');
  const loginMsg = document.getElementById('loginMsg');
  const displayStudentName = document.getElementById('displayStudentName');
  const displayStudentId = document.getElementById('displayStudentId');

  const supabaseUrl = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.SUPABASE_URL)
    ? APP_CONFIG.SUPABASE_URL
    : 'https://aacpvpfkqhwlltwjjiag.supabase.co';
  const supabaseKey = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.SUPABASE_ANON_KEY)
    ? APP_CONFIG.SUPABASE_ANON_KEY
    : '';

  function showMessage(text, type = 'error') {
    if (!loginMsg) return;
    loginMsg.textContent = text;
    loginMsg.className = `gt-msg-box ${type}`;
    loginMsg.classList.remove('hidden');
  }

  function hideMessage() {
    if (!loginMsg) return;
    loginMsg.classList.add('hidden');
    loginMsg.textContent = '';
  }

  function setLoading(loading) {
    if (!btnLogin) return;
    if (loading) {
      btnLogin.disabled = true;
      loginSpinner?.classList.remove('hidden');
      const textSpan = btnLogin.querySelector('.btn-text');
      if (textSpan) textSpan.textContent = 'Đang kiểm tra...';
    } else {
      btnLogin.disabled = false;
      loginSpinner?.classList.add('hidden');
      const textSpan = btnLogin.querySelector('.btn-text');
      if (textSpan) textSpan.textContent = 'KÍCH HOẠT DỊCH';
    }
  }

  function showLoginView(initialError = '') {
    document.documentElement.classList.remove('auth-cached');
    userSection?.classList.add('hidden');
    loginSection?.classList.remove('hidden');
    if (initialError) {
      showMessage(initialError, 'error');
    } else {
      hideMessage();
    }
    setTimeout(() => studentIdInput?.focus(), 100);
  }

  function showUserView(id, name) {
    document.documentElement.classList.add('auth-cached');
    loginSection?.classList.add('hidden');
    userSection?.classList.remove('hidden');
    if (displayStudentId) displayStudentId.textContent = id || '---';
    if (displayStudentName) displayStudentName.textContent = name || 'Tài khoản Google';
  }

  // 1. Instant Local Render (0ms không chớp nháy)
  function tryInstantLocalRender() {
    try {
      const cached = localStorage.getItem('studentAuth');
      if (cached) {
        const auth = JSON.parse(cached);
        if (auth && auth.studentId) {
          showUserView(auth.studentId, auth.name);
          return auth;
        }
      }
    } catch (e) {}
    return null;
  }

  const initialCached = tryInstantLocalRender();

  // 2. Xác thực ngầm với Supabase
  async function checkAuthStatus() {
    try {
      let stored = initialCached;
      if (!stored) {
        stored = await new Promise(resolve => {
          chrome.storage.local.get(['studentAuth'], res => resolve(res?.studentAuth || null));
        });
      }

      if (!stored || !stored.studentId || !stored.sessionToken) {
        localStorage.removeItem('studentAuth');
        showLoginView();
        return;
      }

      showUserView(stored.studentId, stored.name);

      const res = await fetch(`${supabaseUrl}/rest/v1/students?student_id=eq.${encodeURIComponent(stored.studentId)}&select=student_id,name,is_active,session_token`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!res.ok) return;

      const rows = await res.json();
      if (!rows || rows.length === 0 || !rows[0].is_active) {
        localStorage.removeItem('studentAuth');
        await chrome.storage.local.remove(['studentAuth']);
        showLoginView('Tài khoản chưa được kích hoạt hoặc đã bị khóa.');
        return;
      }

      const student = rows[0];
      if (student.session_token !== stored.sessionToken) {
        localStorage.removeItem('studentAuth');
        await chrome.storage.local.remove(['studentAuth']);
        showLoginView('Tài khoản này đã kết nối ở thiết bị khác.');
        return;
      }

      if (student.name && student.name !== stored.name) {
        stored.name = student.name;
        localStorage.setItem('studentAuth', JSON.stringify(stored));
        await chrome.storage.local.set({ studentAuth: stored });
        showUserView(student.student_id, student.name);
      }
    } catch (err) {
      if (!initialCached) {
        showLoginView();
      }
    }
  }

  // 3. Xử lý Đăng nhập
  async function handleLogin() {
    const rawId = (studentIdInput?.value || '').trim().toUpperCase();
    if (!rawId) {
      showMessage('Vui lòng nhập Mã sinh viên (MSV)', 'error');
      studentIdInput?.focus();
      return;
    }

    hideMessage();
    setLoading(true);

    try {
      const checkRes = await fetch(`${supabaseUrl}/rest/v1/students?student_id=eq.${encodeURIComponent(rawId)}&select=student_id,name,is_active`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!checkRes.ok) {
        const errTxt = await checkRes.text();
        throw new Error('Lỗi kết nối máy chủ: ' + errTxt.slice(0, 80));
      }

      const rows = await checkRes.json();
      if (!rows || rows.length === 0) {
        showMessage(`Mã [${rawId}] chưa được cấp quyền sử dụng hệ thống!`, 'error');
        setLoading(false);
        return;
      }

      const student = rows[0];
      if (student.is_active === false) {
        showMessage(`Mã [${rawId}] đã bị khóa quyền truy cập!`, 'error');
        setLoading(false);
        return;
      }

      const newSessionToken = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 12);

      const updateRes = await fetch(`${supabaseUrl}/rest/v1/students?student_id=eq.${encodeURIComponent(rawId)}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          session_token: newSessionToken,
          last_login_at: new Date().toISOString()
        })
      });

      if (!updateRes.ok) {
        throw new Error('Không thể khởi tạo phiên làm việc mới trên máy chủ');
      }

      const authData = {
        studentId: student.student_id,
        name: student.name || student.student_id,
        sessionToken: newSessionToken,
        loggedInAt: Date.now()
      };

      try {
        localStorage.setItem('studentAuth', JSON.stringify(authData));
        document.cookie = `studentAuth=${encodeURIComponent(JSON.stringify(authData))}; path=/; max-age=31536000`;
      } catch (e) {}

      await chrome.storage.local.set({ studentAuth: authData });

      showMessage('Kích hoạt thành công!', 'success');
      setTimeout(() => {
        showUserView(student.student_id, student.name);
      }, 300);

    } catch (err) {
      showMessage(err.message || 'Lỗi kích hoạt', 'error');
    } finally {
      setLoading(false);
    }
  }

  // 4. Xử lý Đăng xuất
  async function handleLogout() {
    try {
      localStorage.removeItem('studentAuth');
      document.cookie = 'studentAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (e) {}
    await chrome.storage.local.remove(['studentAuth']);
    if (studentIdInput) studentIdInput.value = '';
    showLoginView('Đã đăng xuất thành công.');
  }

  // 5. Thao tác kích hoạt nhanh
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

  if (btnLogin) btnLogin.addEventListener('click', handleLogin);
  if (btnLogout) btnLogout.addEventListener('click', handleLogout);
  if (studentIdInput) {
    studentIdInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleLogin();
      }
    });
  }

  checkAuthStatus();
});
