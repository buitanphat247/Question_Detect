# Q&A Detector - Extension bóc tách câu hỏi & đáp án trên Website

Tiện ích mở rộng Google Chrome (Manifest V3) tự động nhận diện và trích xuất danh sách câu hỏi cùng đáp án trên bất kỳ trang web nào bằng cách duyệt cấu trúc DOM từ trên xuống dưới, **hoàn toàn không phụ thuộc vào ID, Class hay thẻ cố định**.

---

## 🚀 Các tính năng chính

1. **Duyệt tuần tự thông minh từ trên xuống dưới**:
   - Tự động nhận diện cấu trúc câu hỏi (`Câu 1`, `Question 2`, `Bài 3`, `1.`, `2)`, dấu `?`...).
   - Tự động gom các đáp án trực thuộc (`A.`, `B.`, `C.`, `D.`, `(A)`, `[B]`, các nút radio/checkbox...).
   - Bóc tách trạng thái đã chọn (nếu có lựa chọn đang được tích).
   - Nhận diện cả ảnh minh họa đính kèm câu hỏi.

2. **Giao diện hiện đại & tiện ích**:
   - Tìm kiếm và lọc câu hỏi realtime.
   - Nút **📍 Cuộn & Highlight** trực tiếp câu hỏi trên trang web.
   - Nút **Sao chép Markdown**, **Sao chép JSON**, **Sao chép Văn bản thuần**, **Tải file TXT**.

---

## 🛠️ Hướng dẫn cài đặt vào trình duyệt (Chrome / Edge / Cốc Cốc / Brave)

1. Mở trình duyệt và truy cập: `chrome://extensions` (hoặc `edge://extensions` nếu dùng Edge).
2. Bật công tắc **"Chế độ dành cho nhà phát triển"** (Developer mode) ở góc trên bên phải.
3. Nhấp vào nút **"Tải tiện ích đã giải nén"** (Load unpacked).
4. Chọn thư mục dự án:
   `c:\Users\Admin\Documents\Workspace\Detect_Question`
5. Tiện ích **Q&A Detector** sẽ xuất hiện trên thanh công cụ của trình duyệt.

---

## 🧪 Cách kiểm thử với trang mẫu

1. Kéo thả file [`test_sample.html`](test_sample.html) vào trình duyệt Chrome.
2. Nhấp vào biểu tượng tiện ích **Q&A Detector** trên thanh tiện ích.
3. Bấm nút **"Quét trang hiện tại"** -> Toàn bộ câu hỏi từ các dạng khác nhau sẽ được bóc tách tức thì!
