<!-- @format -->

# Bí Kíp Nhập Môn Nghịch Thủy Hàn

Tài liệu hướng dẫn toàn diện cho người mới bắt đầu chơi game Nghịch Thủy Hàn. Được xây dựng với React, TypeScript, và Tailwind CSS.

## Tính Năng

- 📚 Tài liệu được phân loại theo chủ đề (tài nguyên, nhiệm vụ, môn phái, v.v.)
- 🔍 Tìm kiếm nhanh toàn bộ nội dung
- 🌓 Giao diện sáng/tối
- 📋 Copy tọa độ dễ dàng với thông báo thành công
- 💬 Hệ thống góp ý với tích hợp Google Forms/Sheets
- 📱 Giao diện responsive, tối ưu cho mobile

## Cài Đặt & Chạy Locally

**Yêu cầu:** Node.js v18+ và npm/yarn

```bash
# Clone repo
git clone https://github.com/Arter2507/Turtorial_NTH.git
cd Turtorial_NTH

# Cài đặt dependencies
npm install

# Tạo file .env từ mẫu và cấu hình endpoint góp ý
cp .env.example .env
# Sửa VITE_FEEDBACK_ENDPOINT trong .env

# Chạy dev server
npm run dev
```

Sau khi chạy, mở [http://localhost:3000](http://localhost:3000) để xem tài liệu.

## Cấu Hình Góp Ý

Hệ thống góp ý hỗ trợ hai cách tích hợp:

1. **Google Forms (Khuyến nghị)**

   - Tạo Google Form với các trường: Email (entry.207403457), Tiêu đề (entry.2134557201), Nội dung (entry.416051144)
   - Lấy URL formResponse (không phải URL viewform)
   - Cấu hình trong .env: `VITE_FEEDBACK_ENDPOINT=<form-response-url>`

2. **Google Apps Script**
   - Xem hướng dẫn chi tiết trong [docs/FEEDBACK_APPS_SCRIPT.md](docs/FEEDBACK_APPS_SCRIPT.md)

## Phát Triển

```bash
# Kiểm tra lỗi TypeScript
npm run typecheck

# Kiểm tra lint
npm run lint

# Build cho production
npm run build
```

## Đóng Góp

Mọi đóng góp đều được hoan nghênh! Vui lòng:

1. Fork repo
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## License

[MIT License](LICENSE)
