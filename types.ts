export interface ExecutiveSummaryItem {
  "Ưu tiên": number;
  "Mô tả": string;
}

export interface ResourceItem {
  "Tên Tài Nguyên": string;
  "Cách Kiếm": string;
  "Ưu Tiên": string;
}

export interface SectionContentObject {
  [key: string]: string;
}

export interface ChestLocation {
  "Tọa độ": string;
  "Vị trí": string;
  "Yêu cầu": string;
}

export interface EncounterLocation {
  "Tọa độ": string;
  "Tên Kỳ Ngộ": string;
  "Yêu cầu": string;
}

export interface TamThanhSonChest {
  "Tọa độ": string;
  "Vị trí": string;
  "Cơ chế": string;
}


export interface LocationsData {
  [locationName: string]: (ChestLocation | EncounterLocation | TamThanhSonChest)[];
}

export interface CharacterBuild {
  "Môn Phái": string;
  "Vai Trò": string;
  [key: string]: any; // Allow for flexible, complex properties
}

export interface SpecialSkillItem {
  "Tên": string;
  "Nguồn"?: string;
  "Hiệu Quả": string;
}

export interface SpecialSkillData {
  "Đặc Kỹ Vũ Khí (Rèn)": SpecialSkillItem[];
  "Đặc Kỹ Áo": SpecialSkillItem[];
  "Trang Bị Khuyên Dùng": string[];
  "Khảm Ngọc": string;
}

export interface CompanionData {
  "Tên Đồng Hành": string;
  "Hiệu Quả Tối Đa": string;
  "Điều Kiện Tối Ưu Bắt Buộc": string;
  "Rủi Ro": string;
  "Thay Thế": string;
}

export interface CurrencyItem {
  "Tên": string;
  "Vai Trò": string;
}

export interface EconomyData {
  "Phân Loại Tiền Tệ": CurrencyItem[];
  "Bí Quyết Kiếm Tiền": string[];
}

export interface SectJoinGuide {
  "Môn Phái": string;
  "Điều Kiện"?: string;
  "Kích Hoạt Kỳ Ngộ": string;
  "Đạo Cụ Chi Tiết"?: string;
  "Điều Kiện Tiên Quyết"?: string;
  "Tuyệt Học Đả Cẩu Bổng Pháp"?: string;
  "Tiến Giai/Xuất Sư"?: string;
  "Nguồn Gốc"?: string;
  "Kích Hoạt Nhập Môn"?: string;
  "Thử Thách"?: string;
  "Đạo Cụ Trấn Phái"?: string;
  "Xuất Sư"?: string;
  "Tiến Giai Thượng Thừa"?: string;
}

export interface DivineWeaponGuide {
  "Kích Hoạt & Khởi Đầu": string;
  "Thử Thách Khẩu Quyết": string;
  "Test Nội Công": string;
  "Nhận Thần Binh Sơ Khai": string;
  "Yêu Cầu Kích Hoạt": string;
  "Thành Phần Thiếu": string;
  "Thành Tựu Cuối Cùng": string;
}

export type SectionContent = SectionContentObject | ResourceItem[];

export interface GameGuideData {
  "Tên Tài Liệu": string;
  "Tóm tắt Điều hành": ExecutiveSummaryItem[];
  "I. Khởi Động & Cơ Chế Cốt Lõi": SectionContentObject;
  "II. Hướng Dẫn Kiếm Tài Nguyên": ResourceItem[];
  "III. Hướng Dẫn Sử Dụng Tài Nguyên": SectionContentObject;
  "IV. Lộ Trình Nhiệm Vụ": SectionContentObject;
  "V. Mẹo Tăng Cấp & Sức Mạnh": SectionContentObject;
  "VI. Vị Trí Rương & Kỳ Ngộ": LocationsData;
  "VII. Hướng Dẫn Build Nhân Vật": CharacterBuild[];
  "VIII. Đặc Kỹ (Rèn) & Trang Bị": SpecialSkillData;
  "IX. Đồng Hành (Quần Hiệp) Tối Ưu": CompanionData;
  "X. Kinh Tế & Kiếm Tiền": EconomyData;
  "XI. Gia Nhập Môn Phái Ẩn (Kỳ Ngộ)": SectJoinGuide[];
  "XII. Kỳ Ngộ Thần Binh": DivineWeaponGuide;
}
