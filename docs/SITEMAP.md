<!-- @format -->

# Sơ đồ & Hướng dẫn sử dụng trang

Tệp này mô tả cấu trúc chính của trang và cách sử dụng các chức năng chính.

## Mục Lục chính

- Trang chính: chứa toàn bộ nội dung hướng dẫn (Các chương mục).
- Mục Lục (Table of Contents): nằm ở cạnh hoặc mở ở mobile, cho phép chuyển nhanh tới các chương.
- Tìm kiếm: thanh tìm kiếm ở header để lọc các mục.
- Nút Góp Ý: mở form để gửi góp ý (Google Forms).
- Tải xuống & Offline: cung cấp các tùy chọn tải PDF / export JSON để đọc offline.

## Hướng dẫn nhanh

1. Tìm nội dung: dùng thanh tìm kiếm ở trên cùng.
2. Mở mục cần đọc: chọn từ Mục Lục (desktop) hoặc mở menu trên mobile.
3. Nghe nội dung: mỗi mục trong Mục Lục có nút "Nghe" — nhấn để nghe nội dung của mục đó.
4. Tải nội dung:
   - Mở nút tải xuống (biểu tượng trong header) → chọn "Tải PDF" để lưu trang hiện tại dưới dạng PDF (sử dụng chức năng Print của trình duyệt).
   - Hoặc chọn "Tải JSON" để tải toàn bộ dữ liệu hướng dẫn (dùng để chạy bản local hoặc import sang bản khác).

## Chạy trang ở chế độ offline (gợi ý)

- Tùy chọn đơn giản:

  1. Lưu trang dưới dạng PDF để đọc khi mạng xuống.
  2. Tải JSON: chạy một server tĩnh cục bộ và hiển thị dữ liệu từ JSON.

- Tùy chọn nâng cao (PWA / Service Worker):
  1. Thêm một Service Worker để cache các tài nguyên tĩnh (HTML/CSS/JS/data).
  2. Khi trang load lần đầu, worker sẽ cache các file thiết yếu. Khi server không sẵn sàng, worker phục vụ phiên bản đã cache.
  3. Tài liệu này không tự động đăng ký worker — người quản trị cần thêm file `service-worker.js` và đăng ký trong mã ứng dụng.

## Gợi ý phát triển

- Nếu muốn hỗ trợ offline chính thức: triển khai PWA (manifest + service worker), cache chiến lược (stale-while-revalidate) cho nội dung hướng dẫn.
- Cân nhắc tạo bản build tĩnh (`npm run build`) và phục vụ bằng server tĩnh (Netlify/Surge) để có thời gian tải nhanh và dễ cache.

---

Nếu muốn mình có thể tạo sẵn một `service-worker.js` mẫu và hướng dẫn cách đăng ký — thông báo mình biết bạn muốn triển khai tự động hay chỉ tài liệu hướng dẫn.
