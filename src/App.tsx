/** @format */

import React, { useState, useMemo } from 'react';
import { guideData } from './types/data';
import type { GameGuideData } from './types/types';
import { useTheme } from './hooks/useTheme';
import { Section } from './components/layout/Section';
import { AppLayout } from './layouts/AppLayout';
import {
	ClipboardListIcon,
	BookOpenIcon,
	CollectionIcon,
	CogIcon,
	CalendarIcon,
	SparklesIcon,
	MapPinIcon,
	ShieldCheckIcon,
	HammerIcon,
	UsersIcon,
	CashIcon,
	KeyIcon,
	SwordIcon,
} from './components/common/icons';
import { ToastProvider } from './components/ui/Toast';

const slugify = (text: string): string => {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '') // remove non-word chars
		.replace(/[\s_-]+/g, '-') // collapse whitespace and replace by -
		.replace(/^-+|-+$/g, ''); // trim -
};

const sectionIcons: Record<string, React.ReactElement> = {
	'Tóm tắt Điều hành': <ClipboardListIcon />,
	'I. Khởi Động & Cơ Chế Cốt Lõi': <BookOpenIcon />,
	'II. Hướng Dẫn Kiếm Tài Nguyên': <CollectionIcon />,
	'III. Hướng Dẫn Sử Dụng Tài Nguyên': <CogIcon />,
	'IV. Lộ Trình Nhiệm Vụ': <CalendarIcon />,
	'V. Mẹo Tăng Cấp & Sức Mạnh': <SparklesIcon />,
	'VI. Vị Trí Rương & Kỳ Ngộ': <MapPinIcon />,
	'VII. Hướng Dẫn Build Nhân Vật': <ShieldCheckIcon />,
	'VIII. Đặc Kỹ (Rèn) & Trang Bị': <HammerIcon />,
	'IX. Đồng Hành (Quần Hiệp) Tối Ưu': <UsersIcon />,
	'X. Kinh Tế & Kiếm Tiền': <CashIcon />,
	'XI. Gia Nhập Môn Phái Ẩn (Kỳ Ngộ)': <KeyIcon />,
	'XII. Kỳ Ngộ Thần Binh': <SwordIcon />,
};

const AppContent: React.FC = () => {
	const [theme, toggleTheme] = useTheme();
	const [searchQuery, setSearchQuery] = useState('');
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isHelpOpen, setIsHelpOpen] = useState(false);

	const sections = useMemo(() => {
		return Object.keys(guideData)
			.filter((key) => key !== 'Tên Tài Liệu')
			.map((key) => ({
				id: slugify(key),
				title: key,
				icon: sectionIcons[key] || <BookOpenIcon />,
			}));
	}, []);

	const filteredData = useMemo(() => {
		if (!searchQuery.trim()) {
			return guideData;
		}

		const lowercasedQuery = searchQuery.toLowerCase();
		const newFilteredData: Partial<GameGuideData> = {
			'Tên Tài Liệu': guideData['Tên Tài Liệu'],
		};

		for (const [key, value] of Object.entries(guideData)) {
			if (key === 'Tên Tài Liệu') continue;

			if (key.toLowerCase().includes(lowercasedQuery)) {
				newFilteredData[key as keyof GameGuideData] = value;
				continue;
			}

			if (typeof value === 'object' && value !== null) {
				const stringifiedValue = JSON.stringify(value).toLowerCase();
				if (stringifiedValue.includes(lowercasedQuery)) {
					newFilteredData[key as keyof GameGuideData] = value;
				}
			}
		}
		return newFilteredData as GameGuideData;
	}, [searchQuery]);

	const matchedSectionIds = useMemo(() => {
		if (!searchQuery.trim()) {
			return new Set<string>();
		}
		const keys = Object.keys(filteredData).filter(
			(key) => key !== 'Tên Tài Liệu'
		);
		return new Set(keys.map(slugify));
	}, [searchQuery, filteredData]);

	const sectionsToRender = Object.entries(filteredData).filter(
		([key]) => key !== 'Tên Tài Liệu'
	);

	return (
		<AppLayout
			guideTitle={guideData['Tên Tài Liệu']}
			theme={theme}
			toggleTheme={toggleTheme}
			searchQuery={searchQuery}
			setSearchQuery={setSearchQuery}
			isMenuOpen={isMenuOpen}
			setIsMenuOpen={setIsMenuOpen}
			isHelpOpen={isHelpOpen}
			setIsHelpOpen={setIsHelpOpen}
			sections={sections}
			matchedSectionIds={matchedSectionIds}>
			{sectionsToRender.length > 0 ? (
				sectionsToRender.map(([key, content]) => (
					<Section
						key={key}
						id={slugify(key)}
						title={key}
						icon={sectionIcons[key]}
						content={content}
						searchQuery={searchQuery}
					/>
				))
			) : (
				<div className='text-center py-16'>
					<h2 className='text-2xl font-semibold text-gray-700 dark:text-gray-300'>
						Không tìm thấy kết quả
					</h2>
					<p className='text-gray-500 dark:text-gray-400 mt-2'>
						Hãy thử một từ khóa tìm kiếm khác.
					</p>
				</div>
			)}
		</AppLayout>
	);
};

const App: React.FC = () => {
	return (
		<ToastProvider>
			<AppContent />
		</ToastProvider>
	);
};

export default App;
