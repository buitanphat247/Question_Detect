// =========================================================================
// POPUP CONTROLLER: AUTHENTICATION & SINGLE ACTIVE SESSION VIA SUPABASE
// =========================================================================

document.addEventListener('DOMContentLoaded', async () => {
  const loginSection = document.getElementById('loginSection');
  const userSection = document.getElementById('userSection');
  const studentIdInput = document.getElementById('studentIdInput');
  const btnLogin = document.getElementById('btnLogin');
  const btnLogout = document.getElementById('btnLogout');
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
    loginMsg.textContent = text;
    loginMsg.className = `msg-box ${type}`;
    loginMsg.classList.remove('hidden');
  }

  function hideMessage() {
    loginMsg.classList.add('hidden');
    loginMsg.textContent = '';
  }

  function setLoading(loading) {
    if (loading) {
      btnLogin.disabled = true;
      loginSpinner.classList.remove('hidden');
      btnLogin.querySelector('.btn-text').textContent = 'Đang kiểm tra...';
    } else {
      btnLogin.disabled = false;
      loginSpinner.classList.add('hidden');
      btnLogin.querySelector('.btn-text').textContent = 'Đăng Nhập Ngay';
    }
  }

  // 1. Kiểm tra trạng thái đăng nhập hiện tại
  async function checkAuthStatus() {
    try {
      const stored = await new Promise(resolve => {
        chrome.storage.local.get(['studentAuth'], res => resolve(res?.studentAuth || null));
      });

      if (!stored || !stored.studentId || !stored.sessionToken) {
        showLoginView();
        return;
      }

      // Đối chiếu với Supabase xem phiên đăng nhập này có còn hợp lệ (hay đã bị máy khác đăng nhập)
      const res = await fetch(`${supabaseUrl}/rest/v1/students?student_id=eq.${encodeURIComponent(stored.studentId)}&select=student_id,name,is_active,session_token`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!res.ok) {
        // Lỗi mạng hoặc database, vẫn cho hiển thị tạm thời nếu có lưu cục bộ
        showUserView(stored.studentId, stored.name);
        return;
      }

      const rows = await res.json();
      if (!rows || rows.length === 0 || !rows[0].is_active) {
        // Tài khoản không tồn tại hoặc đã bị khóa
        await chrome.storage.local.remove(['studentAuth']);
        showLoginView('Tài khoản của bạn đã bị khóa hoặc không tồn tại.');
        return;
      }

      const student = rows[0];
      if (student.session_token !== stored.sessionToken) {
        // ĐÃ BỊ THIẾT BỊ KHÁC ĐĂNG NHẬP ĐÁ VĂNG
        await chrome.storage.local.remove(['studentAuth']);
        showLoginView('⚠️ Tài khoản này đã đăng nhập trên một thiết bị khác. Vui lòng đăng nhập lại!');
        return;
      }

      showUserView(student.student_id, student.name);
    } catch (err) {
      showLoginView();
    }
  }

  function showLoginView(initialError = '') {
    userSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    if (initialError) {
      showMessage(initialError, 'error');
    } else {
      hideMessage();
    }
    setTimeout(() => studentIdInput.focus(), 100);
  }

  function showUserView(id, name) {
    loginSection.classList.add('hidden');
    userSection.classList.remove('hidden');
    displayStudentId.textContent = id;
    displayStudentName.textContent = name || 'Sinh Viên';
  }

  // 2. Xử lý Đăng nhập
  async function handleLogin() {
    const rawId = (studentIdInput.value || '').trim().toUpperCase();
    if (!rawId) {
      showMessage('Vui lòng nhập Mã sinh viên (MSV)', 'error');
      studentIdInput.focus();
      return;
    }

    hideMessage();
    setLoading(true);

    try {
      // Tìm sinh viên trên Supabase
      const checkRes = await fetch(`${supabaseUrl}/rest/v1/students?student_id=eq.${encodeURIComponent(rawId)}&select=student_id,name,is_active`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!checkRes.ok) {
        const errTxt = await checkRes.text();
        throw new Error('Lỗi kết nối Supabase: ' + errTxt.slice(0, 100));
      }

      const rows = await checkRes.json();
      if (!rows || rows.length === 0) {
        showMessage(`Mã sinh viên [${rawId}] chưa được cấp quyền sử dụng hệ thống!`, 'error');
        setLoading(false);
        return;
      }

      const student = rows[0];
      if (student.is_active === false) {
        showMessage(`Mã sinh viên [${rawId}] đã bị khóa quyền truy cập!`, 'error');
        setLoading(false);
        return;
      }

      // Tạo Session Token mới (UUID ngẫu nhiên) để đá tất cả phiên đăng nhập cũ
      const newSessionToken = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 12);

      // Cập nhật session_token mới lên Supabase
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

      // Lưu thông tin phiên vào chrome.storage.local
      await chrome.storage.local.set({
        studentAuth: {
          studentId: student.student_id,
          name: student.name || student.student_id,
          sessionToken: newSessionToken,
          loggedInAt: Date.now()
        }
      });

      showMessage('Đăng nhập thành công!', 'success');
      setTimeout(() => {
        showUserView(student.student_id, student.name);
      }, 500);

    } catch (err) {
      showMessage(err.message || 'Lỗi đăng nhập không xác định', 'error');
    } finally {
      setLoading(false);
    }
  }

  // 3. Xử lý Đăng xuất
  async function handleLogout() {
    await chrome.storage.local.remove(['studentAuth']);
    studentIdInput.value = '';
    showLoginView('Đã đăng xuất thành công.');
  }

  // 4. Xử lý Chụp màn hình & Giải
  const btnSnip = document.getElementById('btnSnip');
  if (btnSnip) {
    btnSnip.addEventListener('click', async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.id) {
          chrome.tabs.sendMessage(tab.id, { action: 'START_STEALTH_SNIP' }, () => {});
        }
      } catch (e) {}
      window.close(); // Đóng popup ngay để trả lại màn hình làm bài
    });
  }

  // Sự kiện
  btnLogin.addEventListener('click', handleLogin);
  btnLogout.addEventListener('click', handleLogout);
  studentIdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  // Chạy kiểm tra ban đầu
  checkAuthStatus();
});
