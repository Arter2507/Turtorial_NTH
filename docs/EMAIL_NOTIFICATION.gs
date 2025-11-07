/** @format */

// Tạo trigger để tự động chạy khi có form submit
function createFormTrigger() {
	const form = FormApp.getActiveForm();
	ScriptApp.newTrigger('onFormSubmit').forForm(form).onFormSubmit().create();
}

// Hàm xử lý khi có form submit
function onFormSubmit(e) {
	const ADMIN_EMAIL = 'tuonggh1@gmail.com';

	// Lấy thông tin từ form submission
	const response = e.response;
	const itemResponses = response.getItemResponses();
	const timestamp = response.getTimestamp();

	// Tạo nội dung email
	let emailBody = 'Có góp ý mới từ Nghịch Thủy Hàn:\n\n';
	emailBody += `Thời gian: ${timestamp}\n\n`;

	// Thêm từng phần trả lời vào email
	itemResponses.forEach(function (itemResponse) {
		const question = itemResponse.getItem().getTitle();
		const answer = itemResponse.getResponse();
		emailBody += `${question}:\n${answer}\n\n`;
	});

	// Gửi email
	MailApp.sendEmail({
		to: ADMIN_EMAIL,
		subject: 'Góp ý mới - Nghịch Thủy Hàn',
		body: emailBody,
	});
}
