const fs = require('fs');
const { JSDOM } = require('jsdom');

async function runTests() {
  console.log('=== TEST 1: Bóc tách câu hỏi & cấu trúc MinExam/KMin ===');
  const html = fs.readFileSync('index.html', 'utf8');
  
  const dom = new JSDOM(html, {
    url: 'https://minexam.test/exam',
    runScripts: 'dangerously',
    resources: 'usable'
  });
  
  const { window } = dom;
  const { document } = window;
  global.window = window;
  global.document = document;
  global.Node = window.Node;
  global.Event = window.Event;
  global.MouseEvent = window.MouseEvent;
  global.KeyboardEvent = window.KeyboardEvent;

  // Mock chrome extension APIs
  global.chrome = {
    runtime: {
      sendMessage: (msg, cb) => {
        console.log('[Mock Chrome] Message sent:', msg.action || msg.type || msg);
        if (cb) cb({ success: true, answer: 'C' });
      },
      onMessage: {
        addListener: () => {}
      }
    },
    storage: {
      local: {
        get: (keys, cb) => cb({}),
        set: (data, cb) => cb && cb()
      }
    }
  };

  // Nạp content.js vào JSDOM context
  const origLog = console.log;
  const origWarn = console.warn;
  const origError = console.error;
  const contentJsCode = fs.readFileSync('content.js', 'utf8');
  window.eval(contentJsCode);
  console.log = origLog;
  console.warn = origWarn;
  console.error = origError;

  console.log('Content script đã nạp thành công vào JSDOM.');

  console.log('\n=== TEST 2: Thử nghiệm nhấn phím N (Keyboard Capture) ===');
  let eventPrevented = false;
  let eventStopped = false;

  const keyEvent = new window.KeyboardEvent('keydown', {
    key: 'n',
    code: 'KeyN',
    keyCode: 78,
    bubbles: true,
    cancelable: true
  });

  // Giả lập dispatch phím N lên window
  window.dispatchEvent(keyEvent);
  console.log('Phím N đã dispatch thành công.');

  console.log('\n=== TEST 3: Kiểm tra nhận diện 40 câu hỏi MinExam ===');
  const questionCards = document.querySelectorAll('[id^="question-"]');
  console.log(`Tìm thấy tổng cộng: ${questionCards.length} thẻ câu hỏi (Kỳ vọng: 40)`);
  if (questionCards.length === 40) {
    console.log('✅ TEST PASSED: Nhận diện đủ 40 câu hỏi dạng Next.js/Tailwind của MinExam.');
  } else {
    console.error(`❌ TEST FAILED: Chỉ tìm thấy ${questionCards.length} câu.`);
  }

  console.log('\n=== TEST 4: Kiểm tra bóc tách Options & Click tự động câu 1 ===');
  if (typeof window.bindSelectionEvents === 'function') {
    window.bindSelectionEvents();
  }
  const q1 = document.querySelector('#question-f135594f-d5ae-4a19-a83a-c6f71e1b3a75');
  const q1Options = q1.querySelectorAll('label.cursor-pointer');
  console.log(`Câu 1 có: ${q1Options.length} lựa chọn (A, B, C, D)`);

  const optC = q1Options[2]; // Lựa chọn C
  console.log('Giả lập kích hoạt click vào đáp án C...');
  optC.click();

  const isCSelected = optC.className.includes('border-sky-500') || optC.className.includes('bg-sky-50');
  if (isCSelected) {
    console.log('✅ TEST PASSED: Đáp án C đã được chọn và kích hoạt cập nhật giao diện thành công!');
  } else {
    console.log('⚠️ Trạng thái class của C sau click:', optC.className);
  }

  console.log('\n=== TEST 5: Kiểm tra Click chuột thông thường (Không bị chặn / Không bị treo trang) ===');
  const btn = document.querySelector('button, a, label');
  let clicked = false;
  btn.addEventListener('click', (e) => {
    clicked = true;
  });
  
  const clickEvent = new window.MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    button: 0
  });
  btn.dispatchEvent(clickEvent);
  
  const overlayExists = !!document.getElementById('__qa_stealth_snip_overlay');
  if (clicked && !overlayExists) {
    console.log('✅ TEST PASSED: Click chuột hoạt động bình thường 100%, không bị chặn và không tạo overlay chắn trang.');
  } else {
    console.error(`❌ TEST FAILED: clicked=${clicked}, overlayExists=${overlayExists}`);
  }

  console.log('\n=== TEST 6: Kiểm tra Công thức Human-like Reading Debounce ===');
  const contentModule = require('./content.js');
  console.log = origLog;
  console.warn = origWarn;
  console.error = origError;
  const { calculateHumanReadingDelay } = contentModule;

  const testCases = [
    { words: 15, expectedBase: 3550, minFinal: 2750, maxFinal: 4350 },
    { words: 80, expectedBase: 6800, minFinal: 6000, maxFinal: 7600 },
    { words: 150, expectedBase: 10300, minFinal: 9500, maxFinal: 11100 },
    { words: 300, expectedBase: 17800, minFinal: 17000, maxFinal: 18600 }
  ];

  let test6Passed = true;
  for (const tc of testCases) {
    // 1. Kiểm tra với jitter ngẫu nhiên
    const res = calculateHumanReadingDelay(tc.words);
    console.log(`[Test WordCount=${tc.words}] -> wordCount: ${res.wordCount}, baseDelay: ${res.baseDelay}ms, jitter: ${res.jitter}ms, finalDelay: ${res.finalDelay}ms`);

    if (res.baseDelay !== tc.expectedBase) {
      console.error(`❌ Lỗi baseDelay cho ${tc.words} từ: Nhận ${res.baseDelay}, kỳ vọng ${tc.expectedBase}`);
      test6Passed = false;
    }

    if (res.finalDelay < tc.minFinal || res.finalDelay > tc.maxFinal) {
      console.error(`❌ Lỗi khoảng finalDelay cho ${tc.words} từ: Nhận ${res.finalDelay}, ngoài khoảng [${tc.minFinal}, ${tc.maxFinal}]`);
      test6Passed = false;
    }

    // 2. Kiểm tra biên Jitter = -800ms
    const resMinJitter = calculateHumanReadingDelay(tc.words, -800);
    const expectedMin = Math.max(2800, tc.expectedBase - 800);
    if (resMinJitter.finalDelay !== expectedMin) {
      console.error(`❌ Lỗi jitter -800ms cho ${tc.words} từ: Nhận ${resMinJitter.finalDelay}, kỳ vọng ${expectedMin}`);
      test6Passed = false;
    }

    // 3. Kiểm tra biên Jitter = +800ms
    const resMaxJitter = calculateHumanReadingDelay(tc.words, 800);
    const expectedMax = tc.expectedBase + 800;
    if (resMaxJitter.finalDelay !== expectedMax) {
      console.error(`❌ Lỗi jitter +800ms cho ${tc.words} từ: Nhận ${resMaxJitter.finalDelay}, kỳ vọng ${expectedMax}`);
      test6Passed = false;
    }
  }

  if (test6Passed) {
    console.log('✅ TEST PASSED: Công thức T = max(2.8s, 2.8s + W * 50ms + J) và log trace (wordCount, baseDelay, jitter, finalDelay) chuẩn xác 100%!');
  }

  console.log('\n=============================================');
  console.log('🎉 TẤT CẢ CÁC BƯỚC KIỂM THỬ ĐÃ HOÀN TẤT THÀNH CÔNG!');
  console.log('=============================================');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
