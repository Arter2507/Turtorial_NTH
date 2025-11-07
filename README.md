<!-- @format -->

# Justice Online (Nghịch Thủy Hàn) - Beginner's Guide

A comprehensive, high-performance, and offline-first Progressive Web App (PWA) designed as an in-depth guide for new players of the MMORPG *Justice Online* (Nghịch Thủy Hàn). This static single-page application provides a clean, fast, and accessible resource for everything from core game mechanics to advanced character builds.

---

## ✨ Key Features

This project was built with a focus on user experience, performance, and accessibility.

-   **Comprehensive Content:** Covers all essential topics for beginners, including core mechanics, resource farming, character builds, secret locations, and economy tips.
-   **Modern Tabbed Interface:** Complex sections are organized into intuitive tabs, making information easy to navigate without endless scrolling.
-   **Real-time Search:** A powerful search bar allows users to instantly filter all content, with matching keywords highlighted for quick reference.
-   **Progressive Web App (PWA):**
    -   **Installable:** Can be installed on mobile and desktop devices for an app-like experience.
    -   **Offline Access:** The service worker caches all essential assets, making the entire guide available even without an internet connection.
-   **Responsive Design:** A mobile-first approach ensures a seamless experience across all devices.
-   **Dark & Light Mode:** A theme-switcher allows users to toggle between light and dark modes, with the preference saved locally.
-   **User Feedback System:** A floating action button opens a modal with a simple rich text editor, allowing users to submit feedback directly to a connected Google Form.
-   **Utility Features:** Includes quality-of-life features like a "Scroll to Top" button and a one-click "Copy Coordinates" button for in-game locations.
-   **Performance-Focused:** As a static site with no backend dependencies, it loads almost instantly and offers a smooth, fluid user experience.

## 🛠️ Tech Stack

-   **Framework:** [React](https://reactjs.org/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **PWA & Caching:** Service Worker with [Workbox](https://developer.chrome.com/docs/workbox/) for robust caching strategies.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

**Prerequisites:**

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Development

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Arter2507/Turtorial_NTH.git
    cd Turtorial_NTH
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Configure Feedback Endpoint:**
    Create a `.env` file from the example and set up your feedback endpoint.
    ```sh
    cp .env.example .env
    ```
    Then, edit the `VITE_FEEDBACK_ENDPOINT` in the `.env` file (see Feedback Configuration section below).

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 💬 Feedback Configuration

The feedback system supports two integration methods:

1.  **Google Forms (Recommended)**
    -   Create a Google Form with fields for: Email, Title, and Content.
    -   Get the `formResponse` URL (not the `viewform` URL).
    -   Set this URL in your `.env` file: `VITE_FEEDBACK_ENDPOINT=<your-form-response-url>`
    -   This method supports email notifications for new feedback.

2.  **Google Apps Script**
    -   For detailed instructions on setting up the Form and email notifications, see [docs/FEEDBACK_APPS_SCRIPT.md](docs/FEEDBACK_APPS_SCRIPT.md).

## 👨‍💻 Development Scripts

-   **Type Check:** Run TypeScript compiler to check for type errors.
    ```bash
    npm run typecheck
    ```
-   **Lint:** Check code for style and formatting errors.
    ```bash
    npm run lint
    ```
-   **Build:** Build the application for production.
    ```bash
    npm run build
    ```

## 🗺️ Sitemap

This project includes an HTML Sitemap (top-down tree view) accessible from the header sitemap button. From the sitemap modal you can view a top-down tree of document sections and jump to any section. If you add or remove sections in the content source (`src/data.ts`), the sitemap will automatically update.

## 🤝 Contributing

Contributions are welcome! Please:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📜 License

Distributed under the [MIT License](LICENSE).

---
---

# Bí Kíp Nhập Môn Nghịch Thủy Hàn

Một ứng dụng web lũy tiến (PWA) hiệu suất cao, hoạt động offline, đóng vai trò là tài liệu hướng dẫn chuyên sâu cho người mới chơi game MMORPG *Nghịch Thủy Hàn*. Ứng dụng trang đơn tĩnh này cung cấp một nguồn tài nguyên sạch, nhanh và dễ truy cập cho mọi thứ, từ cơ chế cốt lõi của trò chơi đến các hướng dẫn build nhân vật nâng cao.

---

## ✨ Tính Năng Chính

Dự án này được xây dựng với trọng tâm là trải nghiệm người dùng, hiệu suất và khả năng truy cập.

-   **Nội dung toàn diện:** Bao gồm tất cả các chủ đề thiết yếu cho người mới bắt đầu, bao gồm cơ chế cốt lõi, farm và quản lý tài nguyên, hướng dẫn build nhân vật chi tiết, vị trí bí mật, và mẹo kinh tế.
-   **Giao diện Tab hiện đại:** Các mục phức tạp được tổ chức thành các tab trực quan, giúp việc điều hướng thông tin trở nên dễ dàng mà không cần cuộn trang vô tận.
-   **Tìm kiếm thời gian thực:** Thanh tìm kiếm mạnh mẽ cho phép người dùng lọc ngay lập tức toàn bộ nội dung, với các từ khóa trùng khớp được tô sáng để dễ dàng tham khảo.
-   **Ứng dụng web lũy tiến (PWA):**
    -   **Có thể cài đặt:** Có thể cài đặt trên thiết bị di động và máy tính để bàn để có trải nghiệm giống như ứng dụng.
    -   **Truy cập ngoại tuyến:** Service worker lưu trữ tất cả các tài sản thiết yếu, giúp toàn bộ hướng dẫn có sẵn ngay cả khi không có kết nối internet.
-   **Thiết kế đáp ứng (Responsive):** Tiếp cận mobile-first đảm bảo trải nghiệm liền mạch trên mọi thiết bị.
-   **Chế độ Sáng & Tối:** Cho phép người dùng chuyển đổi giữa chủ đề sáng và tối, với tùy chọn được lưu cục bộ.
-   **Hệ thống phản hồi người dùng:** Nút hành động nổi mở ra một modal với trình soạn thảo văn bản đơn giản, cho phép người dùng gửi phản hồi và đề xuất trực tiếp đến một Google Form được kết nối.
-   **Tính năng tiện ích:** Bao gồm các tính năng chất lượng cuộc sống như nút "Cuộn lên đầu trang" và nút "Sao chép tọa độ" chỉ bằng một cú nhấp chuột cho các vị trí trong game.
-   **Tập trung vào hiệu suất:** Là một trang web tĩnh không có phụ thuộc backend, nó tải gần như ngay lập tức và cung cấp trải nghiệm người dùng mượt mà.

## 🛠️ Công Nghệ Sử Dụng

-   **Framework:** [React](https://reactjs.org/)
-   **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **PWA & Caching:** Service Worker với [Workbox](https://developer.chrome.com/docs/workbox/) để có chiến lược lưu trữ mạnh mẽ.

## 🚀 Bắt Đầu

Làm theo các hướng dẫn sau để cài đặt và chạy dự án trên máy của bạn.

**Yêu cầu:**

-   [Node.js](https://nodejs.org/) (khuyến nghị v18 trở lên)
-   [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/)

### Cài Đặt & Chạy Locally

1.  **Clone repository:**
    ```sh
    git clone https://github.com/Arter2507/Turtorial_NTH.git
    cd Turtorial_NTH
    ```

2.  **Cài đặt các gói phụ thuộc:**
    ```sh
    npm install
    ```

3.  **Cấu hình endpoint cho tính năng góp ý:**
    Tạo một tệp `.env` từ tệp mẫu.
    ```sh
    cp .env.example .env
    ```
    Sau đó, sửa giá trị `VITE_FEEDBACK_ENDPOINT` trong tệp `.env` (xem chi tiết ở phần Cấu Hình Góp Ý).

4.  **Chạy server phát triển:**
    ```sh
    npm run dev
    ```
    Ứng dụng sẽ có sẵn tại `http://localhost:3000`.

## 💬 Cấu Hình Góp Ý

Hệ thống góp ý hỗ trợ hai cách tích hợp:

1.  **Google Forms (Khuyến nghị)**
    -   Tạo một Google Form với các trường: Email (entry.207403457), Tiêu đề (entry.2134557201), và Nội dung (entry.416051144).
    -   Lấy URL `formResponse` (không phải URL `viewform`).
    -   Cấu hình URL này trong tệp `.env` của bạn: `VITE_FEEDBACK_ENDPOINT=<form-response-url>`.
    -   Phương pháp này hỗ trợ thông báo qua email khi có góp ý mới.

2.  **Google Apps Script**
    -   Để xem hướng dẫn chi tiết về cách cấu hình Form và thông báo qua email, vui lòng xem [docs/FEEDBACK_APPS_SCRIPT.md](docs/FEEDBACK_APPS_SCRIPT.md).

## 👨‍💻 Các Lệnh Phát Triển

-   **Kiểm tra lỗi TypeScript:**
    ```bash
    npm run typecheck
    ```
-   **Kiểm tra lint:**
    ```bash
    npm run lint
    ```
-   **Build cho production:**
    ```bash
    npm run build
    ```

## 🗺️ Sitemap

Dự án này bao gồm một Sơ đồ trang web HTML (dạng cây từ trên xuống) có thể truy cập từ nút sitemap ở đầu trang. Từ modal sitemap, bạn có thể xem cấu trúc cây của các mục tài liệu và chuyển đến bất kỳ mục nào. Nếu bạn thêm hoặc xóa các mục trong nguồn nội dung (`src/data.ts`), sitemap sẽ tự động cập nhật.

## 🤝 Đóng Góp

Mọi đóng góp đều được hoan nghênh! Vui lòng:

1.  Fork repository.
2.  Tạo một branch mới (`git checkout -b feature/AmazingFeature`).
3.  Commit các thay đổi của bạn (`git commit -m 'Add some AmazingFeature'`).
4.  Push lên branch (`git push origin feature/AmazingFeature`).
5.  Mở một Pull Request.

## 📜 Bản Quyền

Dự án được cấp phép theo [Giấy phép MIT](LICENSE).
