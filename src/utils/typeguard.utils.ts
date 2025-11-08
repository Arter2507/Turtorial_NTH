/** @format */

import type {
	ExecutiveSummaryItem,
	ResourceItem,
	LocationsData,
	CharacterBuild,
	SpecialSkillData,
	CompanionData,
	EconomyData,
	SectJoinGuide,
	DivineWeaponGuide,
} from '../types/types';

export const isExecutiveSummaryItem = (
	item: unknown
): item is ExecutiveSummaryItem =>
	typeof item === 'object' &&
	item !== null &&
	'Ưu tiên' in item &&
	'Mô tả' in item;

export const isExecutiveSummary = (c: unknown): c is ExecutiveSummaryItem[] =>
	Array.isArray(c) && c.length > 0 && isExecutiveSummaryItem(c[0]);

export const isResource = (c: unknown): c is ResourceItem[] =>
	Array.isArray(c) &&
	c.length > 0 &&
	typeof c[0] === 'object' &&
	'Tên Tài Nguyên' in c[0];

export const isLocationData = (c: unknown): c is LocationsData => {
	if (typeof c !== 'object' || c === null || Array.isArray(c)) return false;
	const firstValue = Object.values(c)[0];
	return (
		Array.isArray(firstValue) &&
		firstValue.length > 0 &&
		typeof firstValue[0] === 'object' &&
		'Tọa độ' in firstValue[0]
	);
};
export const isCharacterBuilds = (c: unknown): c is CharacterBuild[] =>
	Array.isArray(c) && c.length > 0 && 'Môn Phái' in c[0];
export const isSpecialSkills = (c: unknown): c is SpecialSkillData =>
	typeof c === 'object' && c !== null && 'Đặc Kỹ Vũ Khí (Rèn)' in c;
export const isCompanionData = (c: unknown): c is CompanionData =>
	typeof c === 'object' && c !== null && 'Tên Đồng Hành' in c;
export const isEconomyData = (c: unknown): c is EconomyData =>
	typeof c === 'object' && c !== null && 'Phân Loại Tiền Tệ' in c;
export const isSectJoinData = (c: unknown): c is SectJoinGuide[] =>
	Array.isArray(c) && c.length > 0 && 'Kích Hoạt Kỳ Ngộ' in c[0];
export const isDivineWeaponData = (c: unknown): c is DivineWeaponGuide =>
	typeof c === 'object' && c !== null && 'Kích Hoạt & Khởi Đầu' in c;
