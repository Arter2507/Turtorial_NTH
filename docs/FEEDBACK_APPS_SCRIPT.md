<!-- @format -->

# Cấu Hình Hệ Thống Góp Ý

Hướng dẫn cách tích hợp hai phương pháp nhận góp ý: Google Forms (khuyến nghị) hoặc Google Apps Script.

## I. Sử Dụng Google Forms (Khuyến nghị)

Đây là cách đơn giản nhất để nhận góp ý, không cần code hay deploy server.

1. **Tạo Google Form mới**

   - Mở [forms.google.com](https://forms.google.com)
   - Tạo form mới với 3 trường:
     - Email (không bắt buộc)
     - Tiêu đề góp ý
     - Nội dung góp ý

2. **Lấy IDs của từng trường**

   - Mở Dev Tools (F12) trong trình duyệt
   - Chọn tab Network
   - Điền và gửi form test
   - Tìm request tới `/formResponse`
   - Copy IDs của từng trường:
     ```
     Email: entry.207403457
     Tiêu đề: entry.2134557201
     Nội dung: entry.416051144
     ```

3. **Lấy URL formResponse**

   - Nhấp vào "Gửi" trong Google Forms
   - Copy link, đổi `viewform` thành `formResponse`
   - Ví dụ: `.../forms/d/e/YOUR-FORM-ID/formResponse`

4. **Cấu hình trong project**
   - Tạo file `.env` từ `.env.example`
   - Thêm URL formResponse:
     ```
     VITE_FEEDBACK_ENDPOINT=https://docs.google.com/forms/d/e/YOUR-FORM-ID/formResponse
     ```

## II. Sử Dụng Google Apps Script

Cách này cho phép tùy biến nhiều hơn nhưng cần setup Apps Script.

1. **Tạo Google Sheet và Apps Script**
   - Tạo Google Sheet mới
   - Menu: Extensions → Apps Script
   - Paste code sau vào `Code.gs`:

```js
// Apps Script để nhận POST requests và ghi vào Sheet
function doPost(e) {
	try {
		const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

		// Đọc dữ liệu từ form-urlencoded POST
		const email = (e.parameter && e.parameter.email) || '';
		const title = (e.parameter && e.parameter.title) || '';
		const content = (e.parameter && e.parameter.content) || '';
		const ts =
			(e.parameter && e.parameter.timestamp) || new Date().toISOString();

		// Tạo header nếu sheet trống
		if (sheet.getLastRow() === 0) {
			sheet.appendRow(['ID', 'Email', 'Tiêu đề', 'Nội dung', 'Thời gian']);
		}

		// Append dữ liệu mới
		const nextId = Math.max(1, sheet.getLastRow());
		sheet.appendRow([nextId, email, title, content, ts]);

		return ContentService.createTextOutput(
			JSON.stringify({
				status: 'ok',
				message: 'Đã lưu góp ý thành công',
			})
		).setMimeType(ContentService.MimeType.JSON);
	} catch (err) {
		return ContentService.createTextOutput(
			JSON.stringify({
				status: 'error',
				message: String(err),
			})
		).setMimeType(ContentService.MimeType.JSON);
	}
}
```

2. **Deploy Web App**

   - Click "Deploy" → "New deployment"
   - Chọn "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone" hoặc "Anyone with link"
   - Click Deploy và copy URL Web App

3. **Cấu hình trong project**
   ```
   VITE_FEEDBACK_ENDPOINT=<Web-App-URL>
   ```

## Lưu Ý Bảo Mật

1. **Google Forms**

   - Chỉ cho phép submit qua form UI hoặc formResponse endpoint
   - Google tự động chặn spam và bot
   - Phù hợp cho hầu hết use cases

2. **Apps Script**
   - Ai có URL đều có thể gửi dữ liệu
   - Nếu cần bảo mật hơn:
     - Thêm secret token vào POST data
     - Kiểm tra IP/rate limit trong Apps Script
     - Chỉ cho "Anyone with link" access

## Xử Lý Lỗi

Frontend (`FeedbackButton.tsx`) xử lý một số trường hợp đặc biệt:

1. **Google Forms CORS**

   - Forms thường trả về lỗi CORS ngay cả khi submit thành công
   - Frontend coi một số lỗi fetch là "thành công" và hiện toast phù hợp
   - Kiểm tra sheet để xác nhận dữ liệu đã vào

2. **Apps Script Timeouts**
   - Script có thể timeout sau 30s
   - Frontend hiện thông báo phù hợp
   - Khuyến khích dùng Google Forms cho stable hơn
