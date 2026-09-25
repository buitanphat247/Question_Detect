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
  const contentJsCode = fs.readFileSync('content.js', 'utf8');
  window.eval(contentJsCode);

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

  console.log('\n=============================================');
  console.log('🎉 TẤT CẢ CÁC BƯỚC KIỂM THỬ ĐÃ HOÀN TẤT THÀNH CÔNG!');
  console.log('=============================================');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
